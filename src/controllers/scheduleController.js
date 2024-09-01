const Schedule = require('../models/Schedule');
const { generateHALLinks } = require('../services/halLinks');

// Créer une planification
exports.createSchedule = async (req, res) => {
  const { livreurId, date, startTime, endTime, deliveries } = req.body;
  const userConnected = req.userConnected;

  if (!userConnected) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  let managerId = userConnected.id;
  try {
    const schedule = new Schedule({ managerId, livreurId, date, startTime, endTime, deliveries });
    await schedule.save();

    res.status(201).json({ message: 'Schedule created successfully' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Récupérer toutes les planifications
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('deliveries');
    res.status(200).json({ count: schedules.length, schedules });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Récupérer les planifications par manager
exports.getSchedulesByManager = async (req, res) => {
  const { managerId } = req.params;

  try {
    const schedules = await Schedule.find({ managerId }).populate('deliveries');
    res.status(200).json({ count: schedules.length, schedules });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Récupérer les planifications par livreur
exports.getSchedulesByLivreur = async (req, res) => {
  const { livreurId } = req.params;

  try {
    const schedules = await Schedule.find({ livreurId }).populate('deliveries');
    res.status(200).json({ count: schedules.length, schedules });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Récupérer une planification par ID
exports.getScheduleById = async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findById(id).populate('deliveries');
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Mettre à jour une planification
exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const schedule = await Schedule.findByIdAndUpdate(id, updates, { new: true });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json({ message: 'Schedule updated successfully', schedule });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Supprimer une planification
exports.deleteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Récupérer les tournées planifiées du jour pour un livreur spécifique
exports.getTodaySchedulesForLivreur = async (req, res) => {
  const { livreurId } = req.params;

  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const schedules = await Schedule.find({
      livreurId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).populate('deliveries');

    res.status(200).json({ count: schedules.length, schedules });
  } catch (error) {
    res.status(400).json({ error });
  }
};
