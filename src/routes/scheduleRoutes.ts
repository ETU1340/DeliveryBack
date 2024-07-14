import express from 'express';
import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getSchedulesByManager,
  getSchedulesByLivreur
} from '../controllers/scheduleController';

const router = express.Router();

router.post('/schedules', createSchedule);
router.get('/schedules', getSchedules);
router.get('/schedules/:id', getScheduleById);
router.get('/schedules/manager/:managerId', getSchedulesByManager);
router.get('/schedules/livreur/:livreurId', getSchedulesByLivreur);
router.put('/schedules/:id', updateSchedule);
router.delete('/schedules/:id', deleteSchedule);

export default router;
