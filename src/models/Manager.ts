import mongoose from 'mongoose';
import User from './User';

const ManagerSchema = new mongoose.Schema({
  livreurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Manager = User.discriminator('Manager', ManagerSchema);
export default Manager;
