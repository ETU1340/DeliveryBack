import express from 'express';
import {
  createLivreur,
  getLivreurs,
  getLivreurById,
  updateLivreur,
  deleteLivreur
} from '../controllers/livreurController';

const router = express.Router();

router.post('/livreurs', createLivreur);
router.get('/livreurs', getLivreurs);
router.get('/livreurs/:id', getLivreurById);
router.put('/livreurs/:id', updateLivreur);
router.delete('/livreurs/:id', deleteLivreur);

export default router;
