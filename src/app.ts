import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import livreurRoutes from './routes/livreurRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import deliveryRoutes from './routes/deliveryRoutes';
import discussionRoutes from './routes/discussionRoutes';
import protect from './middlewares/auth';
// Import other routes here

dotenv.config();

const app = express();
mongoose.Promise = global.Promise;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/livreurs', protect,livreurRoutes);
app.use('/api/schedules',protect, scheduleRoutes);
app.use('/api/deliveries',protect, deliveryRoutes);
app.use('/api/chats',protect, discussionRoutes);
// Use other routes here

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL!).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
