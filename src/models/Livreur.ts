import mongoose, { Document, Schema } from 'mongoose';
import User from './User';

// Interface pour les périodes d'indisponibilité
interface IUnavailablePeriod {
  startDate: Date;
  endDate: Date;
  reason: string;
}

// Interface pour les livreurs
interface ILivreur extends Document {
  currentLocation: {
    type: 'Point';
    coordinates: [number, number];
  };
  unavailablePeriods: IUnavailablePeriod[];
}

// Schéma pour les périodes d'indisponibilité
const UnavailablePeriodSchema = new Schema<IUnavailablePeriod>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true }
});

// Schéma pour les livreurs
const LivreurSchema = new Schema<ILivreur>({
  currentLocation: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  unavailablePeriods: [UnavailablePeriodSchema]
});

// Discriminator pour les livreurs
const Livreur = User.discriminator<ILivreur>('Livreur', LivreurSchema);
export default Livreur;
