import { Request, Response } from 'express';
import Schedule from '../models/Schedule';
var hal = require('hal');
import { generateHALLinks } from '../services/halLinks';


// Créer une planification
export const createSchedule = async (req: Request, res: Response) => {
  const {livreurId, date, startTime, endTime, deliveries } = req.body;
  let managerId = req.userConnected.id;
  try {
    const schedule = new Schedule({ managerId, livreurId, date, startTime, endTime, deliveries });
    await schedule.save();

    const resource = new hal.Resource(
      { message: 'Schedule created successfully' },
      `/api/schedules/${schedule._id}`
    );
    const links = generateHALLinks(`/api/schedules/${schedule._id}`, {
      list: { href: '/api/schedules', method: 'GET' },
      update: { href: `/api/schedules/${schedule._id}`, method: 'PUT' },
      delete: { href: `/api/schedules/${schedule._id}`, method: 'DELETE' },
      create: { href: `/api/schedules`, method: 'POST' }
    });
    resource.link(links);

    res.status(201).json(resource.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};
  
  // Récupérer toutes les planifications
export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await Schedule.find().populate('deliveries');
    const resources = new hal.Resource(
      { count: schedules.length, schedules: schedules.map(schedule => schedule.toObject()) },
      `/api/schedules`
    );

    const collectionLinks = generateHALLinks(`/api/schedules`, {
      create: { href: `/api/schedules`, method: 'POST' }
    });
    resources.link(collectionLinks);

    res.status(200).json(resources.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};
  
// Récupérer les planifications par manager
export const getSchedulesByManager = async (req: Request, res: Response) => {
  const { managerId } = req.params;

  try {
    const schedules = await Schedule.find({ managerId }).populate('deliveries');
    const resources = new hal.Resource(
      { count: schedules.length, schedules: schedules.map(schedule => schedule.toObject()) },
      `/api/schedules/manager/${managerId}`
    );

    const collectionLinks = generateHALLinks(`/api/schedules/manager/${managerId}`, {
      create: { href: `/api/schedules`, method: 'POST' },
      list: { href: `/api/schedules`, method: 'GET' }
    });
    resources.link(collectionLinks);

    res.status(200).json(resources.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};
  
// Récupérer les planifications par livreur
export const getSchedulesByLivreur = async (req: Request, res: Response) => {
  const { livreurId } = req.params;

  try {
    const schedules = await Schedule.find({ livreurId }).populate('deliveries');
    const resources = new hal.Resource(
      { count: schedules.length, schedules: schedules.map(schedule => schedule.toObject()) },
      `/api/schedules/livreur/${livreurId}`
    );

    const collectionLinks = generateHALLinks(`/api/schedules/livreur/${livreurId}`, {
      create: { href: `/api/schedules`, method: 'POST' },
      list: { href: `/api/schedules`, method: 'GET' }
    });
    resources.link(collectionLinks);

    res.status(200).json(resources.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Récupérer une planification par ID
export const getScheduleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findById(id).populate('deliveries');
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const resource = new hal.Resource(
      schedule.toObject(),
      `/api/schedules/${schedule._id}`
    );
    const links = generateHALLinks(`/api/schedules/${schedule._id}`, {
      update: { href: `/api/schedules/${schedule._id}`, method: 'PUT' },
      delete: { href: `/api/schedules/${schedule._id}`, method: 'DELETE' },
      list: { href: `/api/schedules`, method: 'GET' },
      create: { href: `/api/schedules`, method: 'POST' }
    });
    resource.link(links);

    res.status(200).json(resource.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Mettre à jour une planification
export const updateSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const schedule = await Schedule.findByIdAndUpdate(id, updates, { new: true });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const resource = new hal.Resource(
      { message: 'Schedule updated successfully', ...schedule.toObject() },
      `/api/schedules/${schedule._id}`
    );
    const links = generateHALLinks(`/api/schedules/${schedule._id}`, {
      update: { href: `/api/schedules/${schedule._id}`, method: 'PUT' },
      delete: { href: `/api/schedules/${schedule._id}`, method: 'DELETE' },
      list: { href: `/api/schedules`, method: 'GET' },
      create: { href: `/api/schedules`, method: 'POST' }
    });
    resource.link(links);

    res.status(200).json(resource.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Supprimer une planification
export const deleteSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const resource = new hal.Resource(
      { message: 'Schedule deleted successfully' },
      `/api/schedules`
    );
    const links = generateHALLinks(`/api/schedules`, {
      create: { href: `/api/schedules`, method: 'POST' },
      list: { href: `/api/schedules`, method: 'GET' }
    });
    resource.link(links);

    res.status(200).json(resource.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};


// Récupérer les tournées planifiées du jour pour un livreur spécifique
export const getTodaySchedulesForLivreur = async (req: Request, res: Response) => {
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

    const resources = new hal.Resource(
      { count: schedules.length, schedules: schedules.map(schedule => schedule.toObject()) },
      `/api/schedules/livreur/${livreurId}/today`
    );

    const collectionLinks = generateHALLinks(`/api/schedules/livreur/${livreurId}/today`, {
      list: { href: `/api/schedules`, method: 'GET' },
      create: { href: `/api/schedules`, method: 'POST' }
    });
    resources.link(collectionLinks);

    res.status(200).json(resources.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};

