import User from './User';
import mongoose from 'mongoose';
const LivreurSchema = new mongoose.Schema({
  vehicle: { type: String, required: true },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  unavailablePeriods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unavailable' }]
});

const Livreur = User.discriminator('Livreur', LivreurSchema);
export { Livreur };
