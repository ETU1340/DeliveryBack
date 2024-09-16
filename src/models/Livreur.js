const mongoose = require('mongoose');
const User = require('./User');
const { LIVREUR } = require('../services/roleService');

// Schéma pour les périodes d'indisponibilité
const UnavailablePeriodSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Génération automatique de l'ID
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status : { type: String,enum: ['En attente', 'Approuvé', 'Refusé']}
});

// Schéma pour les livreurs
const LivreurSchema = new mongoose.Schema({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moyenDeTransport: { type: String, required: true },
  currentLocation: { // Stockage des coordonnées avec des champs latitude et longitude
    latitude: { type: Number },
    longitude: { type: Number }
  },
  unavailablePeriods: [UnavailablePeriodSchema]
});

// Discriminator pour les livreurs
const Livreur = User.discriminator(LIVREUR, LivreurSchema);

module.exports = Livreur;
