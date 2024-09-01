const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const {
  createLivreur,
  getLivreursByManager,
  getLivreurById,
  updateLivreur,
  deleteLivreur,
  getAvailableLivreurs,
  addUnavailablePeriod,
  updateUnavailablePeriod,
  deleteUnavailablePeriod
} = require('../controllers/livreurController');

const router = express.Router();

router.post('/',upload.single('image'), createLivreur);
router.get('/', getLivreursByManager);
router.get('/:id', getLivreurById);
router.get('/available', getAvailableLivreurs);
router.put('/:id',upload.single('image'), updateLivreur);
router.delete('/:id', deleteLivreur);

// Routes pour les périodes d'indisponibilité
router.post('/:livreurId/unavailable', addUnavailablePeriod);
router.put('/:livreurId/unavailable/:periodId', updateUnavailablePeriod);
router.delete('/:livreurId/unavailable/:periodId', deleteUnavailablePeriod);


module.exports = router;
