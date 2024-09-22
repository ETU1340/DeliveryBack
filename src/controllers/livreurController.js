const Livreur = require('../models/Livreur');
const { generatePassword } = require('../services/authService');
const { sendEmails } = require('../services/emailService');
const { getImageUrl } = require('../services/userServices');
const { LIVREUR } = require('../services/roleService');

// Créer un livreur
exports.createLivreur = async (req, res) => {
  const {
    email,
    userName,
    name,
    firstName,
    address,
    phone,
    moyenDeTransport,
    longitude,
    latitude
  } = req.body;
  console.log(req.body);
  const password = generatePassword(8);
  const managerId = req.userConnected?.id;
  console.log(managerId);
  try {
    const image = await getImageUrl(req);
    const livreur = new Livreur({
      email,
      userName,
      password,
      name,
      image,
      firstName,
      address,
      phone,
      role: LIVREUR,
      managerId,
      moyenDeTransport,
      currentLocation: { latitude, longitude }
    });
    await livreur.save();

    const mailOptions = {
      from: 'Company Name <DeliveryService@gmail.com>',
      to: email,
      subject: 'Vos informations de connexion',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Vos informations de connexion</h2>
        <p>Bonjour,</p>
        <p>Vos informations de connexion en tant que livreur sont les suivantes :</p>
        <div style="text-align: center; margin: 20px 0;">
          <p style="font-size: 18px;"><strong>Pseudo :</strong> ${userName}</p>
          <p style="font-size: 18px;"><strong>Mot de passe :</strong> ${password}</p>
        </div>
        <p>Merci,</p>
        <p>L'équipe Support</p>
        </div>
      `
    };
    await sendEmails(mailOptions, res);

    return res.status(201).json({ error: false, message: 'livreur created' });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: true, message: error.message });
  }
};

// Récupérer tous les livreurs
exports.getLivreursByManager = async (req, res) => {
  const id = req.userConnected?.id;
  try {
    const livreurs = await Livreur.find({ managerId: id });
    console.log(livreurs);
    res.status(200).json(livreurs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer un livreur par ID
exports.getLivreurById = async (req, res) => {
  const { id } = req.params;

  try {
    const livreur = await Livreur.findById(id);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }

    res.status(200).json(livreur);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Mettre à jour un livreur
exports.updateLivreur = async (req, res) => {
  const { id } = req.params;
  const { longitude, latitude } = req.body;
  const updates = req.body;
  updates.currentLocation = { latitude, longitude };
  updates.image = await getImageUrl(req);
  console.log(updates);

  try {
    const livreur = await Livreur.findByIdAndUpdate(id, updates);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }
    res.status(200).json({ error: false, message: "livreur modifié avec succès" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Supprimer un livreur
exports.deleteLivreur = async (req, res) => {
  const { id } = req.params;

  try {
    const livreur = await Livreur.findByIdAndDelete(id);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }

    res.status(200).json({ message: 'Livreur deleted successfully' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Récupérer les livreurs disponibles les plus proches
exports.getAvailableLivreurs = async (req, res) => {
  const { deliveryDate, startTime, endTime, deliveryLat, deliveryLong } = req.query;

  try {
    const startDateTime = new Date(`${deliveryDate}T${startTime}:00Z`);
    const endDateTime = new Date(`${deliveryDate}T${endTime}:00Z`);
    const deliveryLocation = {
      type: 'Point',
      coordinates: [parseFloat(deliveryLong), parseFloat(deliveryLat)]
    };

    const livreurs = await Livreur.find({
      currentLocation: {
        $near: {
          $geometry: deliveryLocation
        }
      },
      $or: [
        { unavailablePeriods: { $size: 0 } },
        {
          unavailablePeriods: {
            $not: {
              $elemMatch: {
                startDate: { $lt: endDateTime },
                endDate: { $gt: startDateTime }
              }
            }
          }
        }
      ]
    });

    res.status(200).json({ count: livreurs.length, livreurs });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Ajouter une période d'indisponibilité
exports.addUnavailablePeriod = async (req, res) => {
  const { livreurId } = req.params;
  const { startDate, endDate, reason } = req.body;
  console.log( req.body);

  try {
    const livreur = await Livreur.findById(livreurId);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }

    livreur.unavailablePeriods.push({ startDate, endDate, reason, status:'En attente' });
    await livreur.save();

    res.status(201).json({ message: 'Unavailable period added successfully', unavailablePeriods: livreur.unavailablePeriods });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Mettre à jour une période d'indisponibilité
exports.updateUnavailablePeriod = async (req, res) => {
  const { livreurId, periodId } = req.params;
  const { startDate, endDate, reason } = req.body;

  try {
    const livreur = await Livreur.findById(livreurId);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }

    const period = livreur.unavailablePeriods.id(periodId);
    if (!period) {
      return res.status(404).json({ message: 'Unavailable period not found' });
    }

    period.startDate = startDate;
    period.endDate = endDate;
    period.reason = reason;
    await livreur.save();

    res.status(200).json({ message: 'Unavailable period updated successfully', unavailablePeriods: livreur.unavailablePeriods });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Supprimer une période d'indisponibilité
exports.deleteUnavailablePeriod = async (req, res) => {
  const { livreurId, periodId } = req.params;

  try {
    const livreur = await Livreur.findById(livreurId);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }

    const period = livreur.unavailablePeriods.id(periodId);
    if (!period) {
      return res.status(404).json({ message: 'Unavailable period not found' });
    }

    livreur.unavailablePeriods.pull(periodId);
    await livreur.save();

    res.status(200).json({ message: 'Unavailable period deleted successfully', unavailablePeriods: livreur.unavailablePeriods });
  } catch (error) {
    res.status(400).json({ error });
  }
};
