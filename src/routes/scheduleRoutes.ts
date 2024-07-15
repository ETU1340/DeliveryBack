import express from 'express';
import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getSchedulesByManager,
  getSchedulesByLivreur,
  getTodaySchedulesForLivreur
} from '../controllers/scheduleController';

const router = express.Router();

router.post('/', createSchedule);
router.get('/', getSchedules);
router.get('/:id', getScheduleById);
router.get('/manager/:managerId', getSchedulesByManager);
router.get('/livreur/:livreurId', getSchedulesByLivreur);
router.get('/livreur/:livreurId/today', getTodaySchedulesForLivreur);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;
