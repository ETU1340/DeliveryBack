import { Request, Response } from 'express';
import {Livreur} from '../models/Livreur';
var hal = require('hal');
import { generateHALLinks } from '../services/halLinks';

// Créer un livreur
export const createLivreur = async (req: Request, res: Response) => {
    const { email, password, name, address, phone, latitude, longitude } = req.body;
  
    try {
      const livreur = new Livreur({ email, password, name, address, phone, role: 'Livreur', currentLocation: { latitude, longitude } });
      await livreur.save();
  
      const resource = new hal.Resource(
        { message: 'Livreur created successfully' },
        `/api/livreurs/${livreur._id}`
      );
      const links = generateHALLinks(`/api/livreurs/${livreur._id}`, {
        list: { href: '/api/livreurs', method: 'GET' },
        update: { href: `/api/livreurs/${livreur._id}`, method: 'PUT' },
        delete: { href: `/api/livreurs/${livreur._id}`, method: 'DELETE' },
        create: { href: `/api/livreurs`, method: 'POST' }
      });
      resource.link(links);
  
      res.status(201).json(resource.toJSON());
    } catch (error) {
      res.status(400).json({ error });
    }
  };
  
  // Récupérer tous les livreurs
  export const getLivreurs = async (req: Request, res: Response) => {
    try {
      const livreurs = await Livreur.find();
      const resources = livreurs.map(livreur => {
        const resource = new hal.Resource(
          livreur.toObject(),
          `/api/livreurs/${livreur._id}`
        );
        const links = generateHALLinks(`/api/livreurs/${livreur._id}`, {
          update: { href: `/api/livreurs/${livreur._id}`, method: 'PUT' },
          delete: { href: `/api/livreurs/${livreur._id}`, method: 'DELETE' },
          list: { href: `/api/livreurs`, method: 'GET' },
          create: { href: `/api/livreurs`, method: 'POST' }
        });
        resource.link(links);
        return resource.toJSON();
      });
      res.status(200).json(resources);
    } catch (error) {
      res.status(400).json({ error });
    }
  };
  
  // Récupérer un livreur par ID
  export const getLivreurById = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const livreur = await Livreur.findById(id);
      if (!livreur) {
        return res.status(404).json({ message: 'Livreur not found' });
      }
  
      const resource = new hal.Resource(
        livreur.toObject(),
        `/api/livreurs/${livreur._id}`
      );
      const links = generateHALLinks(`/api/livreurs/${livreur._id}`, {
        update: { href: `/api/livreurs/${livreur._id}`, method: 'PUT' },
        delete: { href: `/api/livreurs/${livreur._id}`, method: 'DELETE' },
        list: { href: `/api/livreurs`, method: 'GET' },
        create: { href: `/api/livreurs`, method: 'POST' }
      });
      resource.link(links);
  
      res.status(200).json(resource.toJSON());
    } catch (error) {
      res.status(400).json({ error });
    }
  };
  
  // Mettre à jour un livreur
  export const updateLivreur = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const livreur = await Livreur.findByIdAndUpdate(id, updates, { new: true });
      if (!livreur) {
        return res.status(404).json({ message: 'Livreur not found' });
      }
  
      const resource = new hal.Resource(
        { message: 'Livreur updated successfully', ...livreur.toObject() },
        `/api/livreurs/${livreur._id}`
      );
      const links = generateHALLinks(`/api/livreurs/${livreur._id}`, {
        update: { href: `/api/livreurs/${livreur._id}`, method: 'PUT' },
        delete: { href: `/api/livreurs/${livreur._id}`, method: 'DELETE' },
        list: { href: `/api/livreurs`, method: 'GET' },
        create: { href: `/api/livreurs`, method: 'POST' }
      });
      resource.link(links);
  
      res.status(200).json(resource.toJSON());
    } catch (error) {
      res.status(400).json({ error });
    }
  };
  
  // Supprimer un livreur
  export const deleteLivreur = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const livreur = await Livreur.findByIdAndDelete(id);
      if (!livreur) {
        return res.status(404).json({ message: 'Livreur not found' });
      }
  
      const resource = new hal.Resource(
        { message: 'Livreur deleted successfully' },
        `/api/livreurs`
      );
      const links = generateHALLinks(`/api/livreurs`, {
        create: { href: `/api/livreurs`, method: 'POST' },
        list: { href: `/api/livreurs`, method: 'GET' }
      });
      resource.link(links);
  
      res.status(200).json(resource.toJSON());
    } catch (error) {
      res.status(400).json({ error });
    }
  };