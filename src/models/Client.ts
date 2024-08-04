import User from './User';
import mongoose from 'mongoose';
const ClientSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  deliveryRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' }],
});

const Client = User.discriminator('Client', ClientSchema);
export default Client;