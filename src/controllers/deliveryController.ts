import Delivery from '../models/Delivery';
import { Request, Response } from 'express';
var hal = require('hal');
import { generateHALLinks } from '../services/halLinks';

// Créer une demande de livraison
export const createDeliveryRequest = async (req: Request, res: Response) => {
  const {deliveryDate, startTime, endTime, deliveryLat, deliveryLong } = req.body;
  let clientId = req.userConnected.id; 
  try {
    const deliveryLocation = {
      type: 'Point',
      coordinates: [parseFloat(deliveryLong), parseFloat(deliveryLat)]
    };

    const delivery = new Delivery({
      clientId,
      deliveryDate,
      startTime,
      endTime,
      deliveryLocation
    });

    await delivery.save();

    const resource = new hal.Resource(
      { message: 'Delivery request created successfully', delivery: delivery.toObject() },
      `/api/deliveries/${delivery._id}`
    );
    const links = generateHALLinks(`/api/deliveries/${delivery._id}`, {
      self: { href: `/api/deliveries/${delivery._id}`, method: 'GET' },
      list: { href: `/api/deliveries`, method: 'GET' },
      update: { href: `/api/deliveries/${delivery._id}`, method: 'PUT' },
      delete: { href: `/api/deliveries/${delivery._id}`, method: 'DELETE' }
    });
    resource.link(links);

    res.status(201).json(resource.toJSON());
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const validateDelivery = async (req: Request, res: Response) => {
const { deliveryId } = req.params;
let clientId = req.userConnected.id; 

try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
    return res.status(404).json({ message: 'Delivery not found' });
    }

    // Vérifiez que le client validant la livraison est le même que celui qui a créé la livraison
    if (delivery.clientId.toString() !== clientId) {
    return res.status(403).json({ message: 'You are not authorized to validate this delivery' });
    }

    delivery.status = 'Completed';
    delivery.updatedAt = new Date();
    await delivery.save();

    const resource = new hal.Resource(
    { message: 'Delivery validated successfully', delivery: delivery.toObject() },
    `/api/deliveries/${delivery._id}`
    );
    const links = generateHALLinks(`/api/deliveries/${delivery._id}`, {
    self: { href: `/api/deliveries/${delivery._id}`, method: 'GET' },
    list: { href: `/api/deliveries`, method: 'GET' },
    update: { href: `/api/deliveries/${delivery._id}`, method: 'PUT' },
    delete: { href: `/api/deliveries/${delivery._id}`, method: 'DELETE' }
    });
    resource.link(links);

    res.status(200).json(resource.toJSON());
} catch (error) {
    res.status(400).json({ error });
}
};
