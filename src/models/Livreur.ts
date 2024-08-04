import mongoose, { Document, Schema } from 'mongoose';
import User from './User';
import {LIVREUR} from '../services/roleService'
// Interface pour les périodes d'indisponibilité
interface IUnavailablePeriod {
  _id: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason: string;
}

// Interface pour les livreurs
interface ILivreur extends Document {
  currentLocation: [number, number]; // Utilisation d'un tableau de nombres pour les coordonnées
  unavailablePeriods: mongoose.Types.DocumentArray<IUnavailablePeriod>;
}

// Schéma pour les périodes d'indisponibilité
const UnavailablePeriodSchema = new Schema<IUnavailablePeriod>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true }
}, { _id: true });

// Schéma pour les livreurs
const LivreurSchema = new Schema<ILivreur>({
  currentLocation: { // Stockage des coordonnées comme un tableau de nombres
  type: [Number]
  },
  unavailablePeriods: [UnavailablePeriodSchema]
});

// Discriminator pour les livreurs
const Livreur = User.discriminator<ILivreur>(LIVREUR, LivreurSchema);
export default Livreur;
