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
  const managerId = chance.pickone(["66f1bb5c2ce12f8ae0db457e"]); // Exemple d'ID de gestionnaire 
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
  let livreurId = chance.pickone(['66c84e294680ba4af1a9f5ed', '66c84e1a4680ba4af1a9f5e3', '66c84e264680ba4af1a9f5e7', '66c84e284680ba4af1a9f5ea']);
  let latitude = chance.pickone([-18.879190, -18.913370, -18.90560, -18.904372, -18.882374]);
  let longitude = chance.pickone([47.507905, 47.536131, 47.536243, 47.516005, 47.530491]);
  let managerId = chance.pickone(['66c4b681d6b47115816e553e','66c4fa71821a99dfaca7d8e3']);

  try {
    // Générer la date et l'heure de début
    let deliveryDateTimeBegin = chance.date({ year: new Date().getFullYear(), month: new Date().getMonth() });

    // Générer une durée entre 1 heure (60 minutes) et 3 heures (180 minutes)
    let deliveryDuration = chance.integer({ min: 60, max: 180 }); // Durée en minutes

    // Générer la date et l'heure de fin en ajoutant la durée à la date de début
    let deliveryDateTimeEnd = new Date(deliveryDateTimeBegin.getTime() + deliveryDuration * 60000);

    // Générer un numéro de référence avec la forme "LIV - 010"
    let referenceNumber = `LIV - ${chance.integer({ min: 100, max: 999 })}`;

    const delivery = new Delivery({
      clientName: chance.first(),
      clientSurname: chance.phone(),
      clientEmail: chance.email(),
      validationCode: chance.string({ length: 10, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }),
      reference: referenceNumber, // Nouvelle référence unique
      deliveryAddress: {
        latitude: latitude,
        longitude: longitude,
      },
      deliveryDateTimeBegin: deliveryDateTimeBegin, // Date et heure de début
      deliveryDateTimeEnd: deliveryDateTimeEnd,     // Date et heure de fin avec la durée
      status: chance.pickone(['En attente', 'En cours', 'Terminé', 'Annulé']),
      livreurId: livreurId,
      managerId: managerId,
    });

    await delivery.save(); 
    console.log(`Fausses livraisons ont été générées avec succès.`);
  } catch (err) {
    console.error('Erreur lors de l\'insertion des livraisons factices:', err);
  }
};


// Générer plusieurs livreurs factices
const generateFakeData = async () => {
  for (let i = 0; i < 50; i++) { // Modifier le nombre pour générer plus ou moins de livreurs
    await createFakeLivreur();
    //await generateFakeDeliveries();
  }
  mongoose.connection.close(); // Fermer la connexion après avoir terminé
};

generateFakeData();
