import express from 'express';
import {
  createDelivery,
  listDeliveries,
  updateDelivery,
  getDeliveryById,
  deleteDelivery,
} from '../controllers/deliveryController';

const router = express.Router();

// Routes for delivery management
router.post('/', createDelivery);
router.get('/', listDeliveries);
router.get('/:id', getDeliveryById);
router.put('/:id', updateDelivery);
router.delete('/:id', deleteDelivery);

export default router;
