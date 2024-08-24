import { Request, Response } from 'express';
import Delivery from '../models/Delivery';

// Create a new delivery
export const createDelivery = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json({ success: true, message: 'Delivery created successfully', delivery });
  } catch (error:any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// List all deliveries
export const listDeliveries = async (req: Request, res: Response) => {
  try {
    const id = req.userConnected?.id;
    const deliveries = await Delivery.find({managerId:id}).populate('livreurId');
    res.status(200).json(deliveries);
  } catch (error:any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update a delivery
export const updateDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedDelivery = await Delivery.findByIdAndUpdate(id, req.body, { new: true }).populate('livreurId managerId');
    if (!updatedDelivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }
    res.status(200).json({ success: true, message: 'Delivery updated successfully', delivery: updatedDelivery });
  } catch (error:any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get a single delivery by ID
export const getDeliveryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id).populate('livreurId managerId');
    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }
    res.status(200).json({ success: true, delivery });
  } catch (error:any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a delivery
export const deleteDelivery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDelivery = await Delivery.findByIdAndDelete(id);
    if (!deletedDelivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }
    res.status(200).json({ success: true, message: 'Delivery deleted successfully' });
  } catch (error:any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
