const mongoose = require('mongoose');
const Chance = require('chance');
const Livreur = require('../models/Livreur'); // Assurez-vous que le chemin est correct
const Delivery = require('../models/Delivery'); 
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Initialiser Chance
const chance = new Chance();
dotenv.config();
console.log(process.env.MONGODB_URL);

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const createFakeLivreur = async () => {
  const managerId = chance.pickone(["66f231b1687f68eb4bcec119"]); // Exemple d'ID de gestionnaire 
  const mdp = "mdp2024";
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(mdp, salt);

  // Obtenir la date actuelle
  const today = new Date();

  try {
    let uniqueEmail, uniqueUserName;

    // Boucle pour générer un email unique
    do {
      uniqueEmail = chance.email();
    } while (await Livreur.findOne({ email: uniqueEmail }));

    // Boucle pour générer un userName unique
    do {
      uniqueUserName = chance.word();
    } while (await Livreur.findOne({ userName: uniqueUserName }));

    // Créer un livreur avec des valeurs uniques
    const livreur = new Livreur({
      email: uniqueEmail,
      userName: uniqueUserName,
      password: password,
      name: chance.last(),
      image: chance.pickone([
        "https://delivery.psad.hco.mg/uploads/livreur/1.jpg",
        "https://delivery.psad.hco.mg/uploads/livreur/3.jpg",
        "https://delivery.psad.hco.mg/uploads/livreur/4.jpg",
        "https://delivery.psad.hco.mg/uploads/livreur/5.jpg",
        "https://delivery.psad.hco.mg/uploads/livreur/6.jpg",
        "https://delivery.psad.hco.mg/uploads/livreur/7.jpg",
        "https://delivery.psad.hco.mg/uploads/livreur/8.jpg",
        "https://delivery.psad.hco.mg/uploads/livreur/9.jpg",
      ]),
      firstName: chance.first(),
      address: chance.address(),
      phone: chance.phone(),
      role: 'livreur',
      managerId: managerId,
      moyenDeTransport: chance.pickone(['Vélo', 'Moto', 'Voiture', 'Camion']), // Types de véhicules

      // Coordonnées aléatoires autour d'Antananarivo (approximation)
      currentLocation: {
        latitude: chance.latitude({ min: -19.0, max: -18.7 }), // Antananarivo approx latitude range
        longitude: chance.longitude({ min: 47.4, max: 47.6 }), // Antananarivo approx longitude range
      },

      unavailablePeriods: [
        {
          startDate: chance.date({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() + chance.integer({ min: 1, max: 5 }) }), // Commence à partir de la date d'aujourd'hui
          endDate: chance.date({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() + chance.integer({ min: 6, max: 30 }) }), // Termine dans un futur proche
          reason: chance.sentence({ words: 5 }),
        },
      ],
    });

    await livreur.save(); // Sauvegarder le livreur
    console.log(`Livreur créé avec succès : ${livreur._id}`);
  } catch (err) {
    console.error('Erreur lors de la création du livreur :', err);
  }
};

const generateFakeDeliveries = async () => {
  let livreurId = chance.pickone([
    '66f231e5d9fe9aeb6050f7ed', '66f231e6d9fe9aeb6050f7f4', '66f231e7d9fe9aeb6050f7f9', 
    '66f231e8d9fe9aeb6050f7fe', '66f231e9d9fe9aeb6050f803', '66f231ead9fe9aeb6050f808',
    // Ajoutez d'autres livreurId ici si nécessaire
  ]);

  // Localisations spécifiques à Antananarivo, Madagascar
  let managerId = '66f231b1687f68eb4bcec119';  // Manager ID fixe

  try {
    // Date de début - entre aujourd'hui et le 30 octobre
    let today = new Date();
    let deliveryDateTimeBegin = chance.date({
      min: today,
      max: new Date(today.getFullYear(), 9, 31)  // Octobre est le mois 9 en JavaScript
    });

    // Générer une durée entre 1 heure (60 minutes) et 3 heures (180 minutes)
    let deliveryDuration = chance.integer({ min: 60, max: 180 }); // Durée en minutes

    // Calculer la date de fin en ajoutant la durée
    let deliveryDateTimeEnd = new Date(deliveryDateTimeBegin.getTime() + deliveryDuration * 60000);

    // Générer un numéro de référence avec la forme "LIV - XXX"
    let referenceNumber = `LIV - ${chance.integer({ min: 100, max: 999 })}`;

    // Créer et sauvegarder la livraison
    const delivery = new Delivery({
      clientName: chance.first(),
      clientSurname: chance.last(),
      clientEmail: chance.email(),
      validationCode: chance.string({ length: 10, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }),
      reference: referenceNumber,  // Nouvelle référence unique
      deliveryAddress: {
        latitude: chance.latitude({ min: -19.0, max: -18.7 }), // Antananarivo approx latitude range
        longitude: chance.longitude({ min: 47.4, max: 47.6 }) // Antananarivo approx longitude range  latitude: latitude,
      },
      deliveryDateTimeBegin: deliveryDateTimeBegin,  // Date et heure de début
      deliveryDateTimeEnd: deliveryDateTimeEnd,      // Date et heure de fin
      status: chance.pickone(['En attente', 'En cours', 'Terminé', 'Annulé']),
      livreurId: livreurId,
      managerId: managerId,
    });

    // Sauvegarder la livraison
    await delivery.save();
    console.log(`Fausses livraisons ont été générées avec succès.`);
  } catch (err) {
    console.error('Erreur lors de l\'insertion des livraisons factices:', err);
  }
};



// Générer plusieurs livreurs factices
const generateFakeData = async () => {
  for (let i = 0; i < 50; i++) { // Modifier le nombre pour générer plus ou moins de livreurs
    //await createFakeLivreur();
    await generateFakeDeliveries();
  }
  mongoose.connection.close(); // Fermer la connexion après avoir terminé
};

generateFakeData();
