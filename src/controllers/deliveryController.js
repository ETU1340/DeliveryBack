const Delivery = require('../models/Delivery');
const { sendEmails } = require('../services/emailService');
// Create a new delivery
exports.createDelivery = async (req, res) => {
  try {
    console.log(req.body);
    const {clientSurname,clientName,clientEmail,validationCode,reference,deliveryAddress,deliveryDateTime,deliveryEndDateTime,livreurId,managerId,status} = req.body;
    const delivery = new Delivery({  
      clientName,
      clientSurname,
      clientEmail,
      validationCode,
      reference,
      deliveryAddress,
      deliveryDateTimeBegin:deliveryDateTime,  // Combined DateTime field
      deliveryDateTimeEnd:deliveryEndDateTime,
      status,
      livreurId,
      managerId});
    await delivery.save();

    const mailOptions = {
      from: 'Company@gmail.com',
      to: clientEmail,
      subject: 'Votre code de validation pour la livraison',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50; text-align: center;">Votre code de validation</h2>
          <p>Bonjour,</p>
          <p>Nous vous informons que votre code de validation pour la réception de votre livraison est le suivant :</p>
          <div style="text-align: center; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; color: #ff5722;">${validationCode}</p> <!-- Le code de validation est mis en avant -->
          </div>
          <p style="color: #555;">Veuillez fournir ce code au livreur lors de la livraison.</p>
          <p>Merci pour votre confiance,</p>
          <p>L'équipe Support</p>
        </div>
      `
    };
    
    await sendEmails(mailOptions, res);
    res.status(201).json({ success: true, message: 'Delivery created successfully', delivery });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// List all deliveries
exports.listDeliveries = async (req, res) => {
  try {
    const id = req.userConnected ? req.userConnected.id : null;
     // Récupération de la date actuelle sans l'heure (à minuit)
     const today = new Date();
     today.setHours(0, 0, 0, 0);
 
     // Récupération de la date du lendemain (à minuit)
     const tomorrow = new Date(today);
     tomorrow.setDate(tomorrow.getDate() + 1);
     
    const deliveries = await Delivery.find({
      managerId: id,
      deliveryDateTimeBegin: { $gte: today, $lt: tomorrow }, // Condition de date actuelle
      status: { $nin: ['Terminé', 'Annulé'] },

     }).populate('livreurId');
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.listDeliveriesByLivreur = async (req, res) => {
  try {
    const id = req.params.id;
    const deliveries = await Delivery.find({ livreurId: id }).populate('livreurId');
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.listDeliveriesByLivreurNow = async (req, res) => {
  try {
    const id = req.params.id;

    // Récupération de la date actuelle sans l'heure (à minuit)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Récupération de la date du lendemain (à minuit)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const deliveries = await Delivery.find({
      livreurId: id,
      deliveryDateTimeBegin: { $gte: today, $lt: tomorrow }, // Condition de date actuelle
      status: { $nin: ['Terminé', 'Annulé'] } // Status différent de 'Terminé' et 'Annulé'
    }).populate('livreurId');
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



// Update a delivery
exports.updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const updatedDelivery = await Delivery.findByIdAndUpdate(id, req.body, { new: true }).populate('livreurId managerId');
    if (!updatedDelivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }
    res.status(200).json({ success: true, message: 'Delivery updated successfully', delivery: updatedDelivery });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get a single delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id).populate('livreurId managerId');
    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }
    res.status(200).json({ success: true, delivery });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a delivery
exports.deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDelivery = await Delivery.findByIdAndDelete(id);
    if (!deletedDelivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }
    res.status(200).json({ success: true, message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
