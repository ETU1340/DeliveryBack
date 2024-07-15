import express from 'express';
import { createDeliveryRequest ,validateDelivery} from '../controllers/deliveryController';

const router = express.Router();

router.post('/', createDeliveryRequest);
router.put('/deliveries/:deliveryId/validate', validateDelivery);

export default router;
