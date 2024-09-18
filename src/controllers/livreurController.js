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
      from: 'Company@gmail.com',
      to: email,
      subject: 'Vos informations de connexion',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Vos informations de connexion</h2>
        <p>Bonjour,</p>
        <p>Vos informations de connexion sont les suivantes :</p>
        <div style="text-align: center; margin: 20px 0;">
          <p style="font-size: 18px;"><strong>Pseudo :</strong> ${userName}</p>
          <p style="font-size: 18px;"><strong>Mot de passe :</strong> ${password}</p>
          <p style="font-size: 18px;"><strong>Role :</strong> LIVREUR</p>
        </div>
        <p style="color: #555;">Veuillez changer votre mot de passe dès votre première connexion.</p>
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

// Fonction pour obtenir les livreurs disponibles
exports.getLivreursDisponibles = async (req, res) => {
  const { managerId, startDate, endDate } = req.query;

  if (!managerId || !startDate || !endDate) {
    return res.status(400).json({ message: 'Veuillez fournir un managerId, startDate et endDate' });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. Récupérer tous les livreurs du manager
    const livreurs = await Livreur.find({ managerId });

    // 2. Filtrer les livreurs qui n'ont pas de livraisons chevauchantes
    const livreursDisponibles = [];

    for (const livreur of livreurs) {
      const livraisonChevauche = await Delivery.findOne({
        livreurId: livreur._id,
        status: { $in: ['En cours', 'En attente'] },
        $or: [
          { deliveryDateTime: { $lte: end }, deliveryEndDateTime: { $gte: start } },
          { deliveryEndDateTime: { $gte: start, $lte: end } },
        ],
      });

      if (!livraisonChevauche) {
        livreursDisponibles.push(livreur);
      }
    }

    return res.json(livreursDisponibles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur' });
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
