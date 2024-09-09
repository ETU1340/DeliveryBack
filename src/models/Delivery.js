const mongoose = require('mongoose');
const { Schema } = mongoose;

// Delivery Schema
const DeliverySchema = new Schema({
  clientName: { type: String, required: true },
  clientSurname: { type: String, required: true },
  clientEmail: { type: String, required: true },
  validationCode: { type: String, required: true },
  reference: { type: String, required: true },
  deliveryAddress: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  deliveryDateTimeBegin: { type: Date, required: true },  // Combined DateTime field
  deliveryDateTimeEnd: { type: Date, required: true },
  status: { type: String, enum: ['En attente', 'En cours', 'Terminé', 'Annulé'], default: 'En attente' },
  livreurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

const Delivery = mongoose.model('Delivery', DeliverySchema);
module.exports = Delivery;
