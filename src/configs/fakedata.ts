import mongoose from 'mongoose';
import Chance from 'chance';
import Livreur from '../models/Livreur'; // Assurez-vous que le chemin est correct
import Delivery from '../models/Delivery'; 
import dotenv from 'dotenv';
// Initialiser Chance
const chance = new Chance();
dotenv.config();
console.log(process.env.MONGODB_URL);
// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URL!);

// Fonction pour générer un livreur factice
const createFakeLivreur = async () => {
  const managerId = "66c4b681d6b47115816e553e"; // Exemple d'ID de gestionnaire
  
  try {
    // Créer un livreur lié à cet utilisateur
    const livreur = new Livreur({
      email: chance.email(),
      userName: chance.word(),
      password: chance.string({ length: 8 }),
      name: chance.last(),
      image :"http://localhost:7000/uploads/other/default_man.png",
      firstName: chance.first(),
      address: chance.address(),
      phone: chance.phone(),
      role: 'livreur',
      managerId: managerId,
      moyenDeTransport: chance.pickone(['Vélo',
        'Moto',
        'Voiture',
        'Camion',]), // Exemple de types de véhicules
      currentLocation: {
        latitude: chance.latitude(),
        longitude: chance.longitude(),
      },
      unavailablePeriods: [
        {
          startDate: chance.date({ year: 2023 }), // Une date passée
          endDate: chance.date({ year: 2024 }),   // Une date future
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


// Fonction pour générer des données factices
const generateFakeDeliveries = async () => {

  let livreurId = chance.pickone(['66c84e294680ba4af1a9f5ed', '66c84e1a4680ba4af1a9f5e3', '66c84e264680ba4af1a9f5e7', '66c84e284680ba4af1a9f5ea']);
  let latitude = chance.pickone([-18.879190,  -18.913370, -18.90560, -18.904372,-18.882374]);
  let longitude = chance.pickone([ 47.507905, 47.536131, 47.536243, 47.516005, 47.530491]);
  let managerId ="66c4b681d6b47115816e553e" ;
  try {
    const delivery = new Delivery ({
      clientName: chance.first(),
      clientSurname: chance.phone(),
      clientEmail: chance.email(),
      validationCode: chance.string({ length: 10, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }),
      reference: chance.guid(),
      deliveryAddress: {
        latitude: latitude,
        longitude: longitude,
      },
      deliveryDateTime: chance.date({ year: new Date().getFullYear(), month: new Date().getMonth() }),
      deliveryType: chance.pickone(['Urgent', 'Standard']),
      status: chance.pickone(['En attente', 'En cours', 'Terminé', 'Annulé']),
      livreurId:livreurId, // Faux ObjectId pour simuler un livreur
      managerId:managerId, // Faux ObjectId pour simuler un manager
    });


    await delivery.save(); 
    console.log(`fausses livraisons ont été générées avec succès.`);
  } catch (err) {
    console.error('Erreur lors de l\'insertion des livraisons factices:', err);
  }
};


// Générer plusieurs livreurs factices
const generateFakeData = async () => {
  for (let i = 0; i < 10; i++) { // Modifier le nombre pour générer plus ou moins de livreurs
   // await createFakeLivreur();
   await generateFakeDeliveries();
  }
  mongoose.connection.close(); // Fermer la connexion après avoir terminé
};

generateFakeData();
