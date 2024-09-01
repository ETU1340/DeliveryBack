const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const livreurRoutes = require('./routes/livreurRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const protect = require('./middlewares/auth');
// Import other routes here

dotenv.config();

const app = express();
mongoose.Promise = global.Promise;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/livreurs', protect, livreurRoutes);
app.use('/api/schedules', protect, scheduleRoutes);
app.use('/api/deliveries', protect, deliveryRoutes);
app.use('/api/chats', protect, discussionRoutes);
// Use other routes here

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
