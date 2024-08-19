import mongoose, { Document, Schema } from 'mongoose';
import User from './User';
import { LIVREUR } from '../services/roleService';

// Interface pour les périodes d'indisponibilité
interface IUnavailablePeriod {
  _id: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason: string;
}

// Interface pour les livreurs
interface ILivreur extends Document {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  unavailablePeriods: mongoose.Types.DocumentArray<IUnavailablePeriod>;
}

// Schéma pour les périodes d'indisponibilité
const UnavailablePeriodSchema = new Schema<IUnavailablePeriod>({
  _id: { type: Schema.Types.ObjectId, auto: true }, // Génération automatique de l'ID
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true }
});

// Schéma pour les livreurs
const LivreurSchema = new Schema<ILivreur>({
  currentLocation: { // Stockage des coordonnées avec des champs latitude et longitude
    latitude: { type: Number},
    longitude: { type: Number }
  },
  unavailablePeriods: [UnavailablePeriodSchema]
});

// Discriminator pour les livreurs
const Livreur = User.discriminator<ILivreur>(LIVREUR, LivreurSchema);
export default Livreur;
