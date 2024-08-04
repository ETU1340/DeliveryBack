import User from './User';
import mongoose from 'mongoose';
const ManagerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  livreurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Manager = User.discriminator('Manager', ManagerSchema);
export default Manager;
