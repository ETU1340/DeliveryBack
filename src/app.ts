import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import livreurRoutes from './routes/livreurRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
// Import other routes here

dotenv.config();

const app = express();
mongoose.Promise = global.Promise;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', livreurRoutes);
app.use('/api', scheduleRoutes);
// Use other routes here

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL!).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
