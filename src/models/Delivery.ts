import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  livreurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  status: { type: String, required: true, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
  deliveryDate: { type: Date, required: true }, // Date de la livraison
  startTime: { type: String, required: true }, // Heure de début de la livraison (ex: "09:00")
  endTime: { type: String, required: true },   // Heure de fin de la livraison (ex: "09:30")
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
