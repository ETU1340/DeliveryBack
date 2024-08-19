import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  livreurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, required: true, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  deliveryDate: { type: Date, required: true },
  startTime: { type: String, required: true }, // Utiliser le format ISO 8601 si possible (HH:mm:ss).
  endTime: { type: String, required: true },   // Idem.
  deliveryLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pour mettre à jour la date de mise à jour
DeliverySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Delivery = mongoose.model('Delivery', DeliverySchema);
export default Delivery;
