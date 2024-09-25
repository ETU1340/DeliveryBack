const express = require('express');
const {  
  createDelivery,
  listDeliveries,
  updateDelivery,
  getDeliveryById,
  listDeliveriesByLivreur,
  deleteDelivery,
  listDeliveriesByLivreurNow,getLivreursDisponibles} = require('../controllers/deliveryController');

const router = express.Router();

// Routes for delivery management
router.post('/', createDelivery);
router.get('/', listDeliveries);
router.get('/now', listDeliveries);
router.get('/livreur/:id', listDeliveriesByLivreur);
router.get('/now/:id', listDeliveriesByLivreurNow);
router.get('/:id', getDeliveryById);
router.put('/:id', updateDelivery);
router.delete('/:id', deleteDelivery);

module.exports = router;
