import express from 'express';
import { register, login, logout } from '../controllers/authController';
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post('/register',upload.single('image'), register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
