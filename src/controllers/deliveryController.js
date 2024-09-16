const Delivery = require('../models/Delivery');

// Create a new delivery
exports.createDelivery = async (req, res) => {
  try {
    console.log(req.body);
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json({ success: true, message: 'Delivery created successfully', delivery });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// List all deliveries
exports.listDeliveries = async (req, res) => {
  try {
    const id = req.userConnected ? req.userConnected.id : null;
    const deliveries = await Delivery.find({ managerId: id }).populate('livreurId');
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
