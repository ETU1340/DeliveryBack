import express from 'express';
const upload = require('../middlewares/uploadMiddleware');
import {
  createLivreur,
  getLivreurs,
  getLivreurById,
  updateLivreur,
  deleteLivreur,
  getAvailableLivreurs,
  addUnavailablePeriod,
  updateUnavailablePeriod,
  deleteUnavailablePeriod
} from '../controllers/livreurController';

const router = express.Router();

router.post('/',upload.single('image'), createLivreur);
router.get('/', getLivreurs);
router.get('/:id', getLivreurById);
router.get('/available', getAvailableLivreurs);
router.put('/:id', updateLivreur);
router.delete('/:id', deleteLivreur);

// Routes pour les périodes d'indisponibilité
router.post('/:livreurId/unavailable', addUnavailablePeriod);
router.put('/:livreurId/unavailable/:periodId', updateUnavailablePeriod);
router.delete('/:livreurId/unavailable/:periodId', deleteUnavailablePeriod);


export default router;
