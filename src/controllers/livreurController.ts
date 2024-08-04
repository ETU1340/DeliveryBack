import { Request, Response } from 'express';
import User  from '../models/User';
import Livreur  from '../models/Livreur';
var hal = require('hal');
import {MANAGER,CLIENT,LIVREUR} from '../services/roleService'
import { generateHALLinks } from '../services/halLinks';
const { generatePassword } = require('../services/authService');
const { sendEmails } = require('../services/emailService');
// Créer un livreur
export const createLivreur = async (req: Request, res: Response) => {
    const { email, name,firstName,userName, address, phone} = req.body;
    const password = generatePassword(8);
    console.log(req.body);
  
    try {
      const livreur = new Livreur({ email,userName, password, name,firstName, address, phone, LIVREUR});
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
              <p style="font-size: 18px;"><strong>Role : </strong> ${LIVREUR}</p>
        </div>
        <p style="color: #555;">Veuillez changer votre mot de passe dès votre première connexion.</p>
        <p>Merci,</p>
        <p>L'équipe Support</p>
    </div>
      `
      };
      await sendEmails(mailOptions,res);
  /*
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
  */
    return res.status(201).json({error:false , message: 'livreur created' });
    } catch (error :any) {
      console.log(error.message);
      res.status(400).json({ error:true,message:error.message });
    }
  };
  
  // Récupérer tous les livreurs
  export const getLivreurs = async (req: Request, res: Response) => {
    try {
      const livreurs = await Livreur.find({role:LIVREUR});
      /*
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
      */
      res.status(200).json(livreurs);
    } catch (error:any) {
      res.status(400).json({ erro:error.message });
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



// Récupérer les livreurs disponibles les plus proches (suggestion de livreur d'une planification, se referer par rapport à la premiére livraison)
export const getAvailableLivreurs = async (req: Request, res: Response) => {
  const { deliveryDate, startTime, endTime, deliveryLat, deliveryLong } = req.query;

  try {
    const startDateTime = new Date(`${deliveryDate}T${startTime}:00Z`);
    const endDateTime = new Date(`${deliveryDate}T${endTime}:00Z`);
    const deliveryLocation = {
      type: 'Point',
      coordinates: [parseFloat(deliveryLong as string), parseFloat(deliveryLat as string)]
    };

    const livreurs = await Livreur.find({
      currentLocation: {
        $near: {
          $geometry: deliveryLocation
        }
      },
      $or: [
        { unavailablePeriods: { $size: 0 } },
        { unavailablePeriods: { 
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

    const resources = new hal.Resource(
      { count: livreurs.length, livreurs: livreurs.map(livreur => livreur.toObject()) },
      `/api/livreurs/available`
    );

    const collectionLinks = generateHALLinks(`/api/livreurs/available`, {
      list: { href: `/api/livreurs`, method: 'GET' },
      create: { href: `/api/livreurs`, method: 'POST' }
    });
    resources.link(collectionLinks);

    res.status(200).json(resources.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};
// Ajouter une période d'indisponibilité
export const addUnavailablePeriod = async (req: Request, res: Response) => {
  const { livreurId } = req.params;
  const { startDate, endDate, reason } = req.body;

  try {
    const livreur = await Livreur.findById(livreurId);
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }

    livreur.unavailablePeriods.push({ startDate, endDate, reason });
    await livreur.save();

    const resource = new hal.Resource(
      { message: 'Unavailable period added successfully', unavailablePeriods: livreur.unavailablePeriods },
      `/api/livreurs/${livreurId}/unavailable`
    );
    const links = generateHALLinks(`/api/livreurs/${livreurId}/unavailable`, {
      self: { href: `/api/livreurs/${livreurId}/unavailable`, method: 'POST' },
      getLivreur: { href: `/api/livreurs/${livreurId}`, method: 'GET' }
    });
    resource.link(links);

    res.status(201).json(resource.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Mettre à jour une période d'indisponibilité
export const updateUnavailablePeriod = async (req: Request, res: Response) => {
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
export const deleteUnavailablePeriod = async (req: Request, res: Response) => {
  const { livreurId, periodId } = req.params;

  try {
    const livreur = await Livreur.findById(livreurId) ;
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur not found' });
    }

    const period = livreur.unavailablePeriods.id(periodId);
    if (!period) {
      return res.status(404).json({ message: 'Unavailable period not found' });
    }

    livreur.unavailablePeriods.pull(periodId);
    await livreur.save();

    const resource = new hal.Resource(
      { message: 'Unavailable period deleted successfully', unavailablePeriods: livreur.unavailablePeriods },
      `/api/livreurs/${livreurId}/unavailable/${periodId}`
    );
    const links = generateHALLinks(`/api/livreurs/${livreurId}/unavailable/${periodId}`, {
      self: { href: `/api/livreurs/${livreurId}/unavailable/${periodId}`, method: 'DELETE' },
      getLivreur: { href: `/api/livreurs/${livreurId}`, method: 'GET' }
    });
    resource.link(links);

    res.status(200).json(resource.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};