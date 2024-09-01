const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post('/register',upload.single('image'), register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
