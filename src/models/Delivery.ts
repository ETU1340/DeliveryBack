import mongoose, { Schema, Document } from 'mongoose';

// Interface for Delivery
export interface IDelivery extends Document {
  clientName: string;
  clientSurname: string;
  clientEmail: string;
  validationCode: string;
  reference: string;
  deliveryAddress: {
    latitude: number;
    longitude: number;
  };
  deliveryDateTime: Date;  // Combined DateTime field
  deliveryType: 'Urgent' | 'Standard';
  status: 'En attente' | 'En cours' | 'Terminé' | 'Annulé';
  livreurId?: mongoose.Schema.Types.ObjectId;
  managerId: mongoose.Schema.Types.ObjectId;
}

// Delivery Schema
const DeliverySchema: Schema = new Schema<IDelivery>({
  clientName: { type: String, required: true },
  clientSurname: { type: String, required: true },
  clientEmail: { type: String, required: true },
  validationCode: { type: String, required: true },
  reference: { type: String, required: true },
  deliveryAddress: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  deliveryDateTime: { type: Date, required: true },  // Combined DateTime field
  deliveryType: { type: String, enum: ['Urgent', 'Standard'], required: true },
  status: { type: String, enum: ['En attente', 'En cours', 'Terminé', 'Annulé'], default: 'En attente' },
  livreurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

const Delivery = mongoose.model<IDelivery>('Delivery', DeliverySchema);
export default Delivery;
