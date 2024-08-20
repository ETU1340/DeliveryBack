import mongoose from 'mongoose';
import faker from 'faker';
import Livreur from '../models/Livreur'; // Assurez-vous que le chemin est correct

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URL!);
// Fonction pour générer un livreur factice
const createFakeLivreur = async () => {
    const managerId = "66c4b681d6b47115816e553e";
  try {
    // Créer un livreur lié à cet utilisateur
    const livreur = new Livreur({
        email: faker.internet.email(),
        userName: faker.internet.userName(),
        password: faker.internet.password(),
        name: faker.name.lastName(),
        firstName: faker.name.firstName(),
        address: faker.address.streetAddress(),
        phone: faker.phone.phoneNumber(),
        role: 'Livreur',
        managerId: managerId,
        moyenDeTransport: faker.vehicle.type(),
        currentLocation: {
            latitude: faker.address.latitude(),
            longitude: faker.address.longitude(),
        },
        unavailablePeriods: [
            {
            startDate: faker.date.past(),
            endDate: faker.date.future(),
            reason: faker.lorem.sentence(),
            },
        ],
    });

    await livreur.save(); // Sauvegarder le livreur
    console.log(`Livreur créé avec succès : ${livreur._id}`);
  } catch (err) {
    console.error('Erreur lors de la création du livreur :', err);
  }
};

// Générer plusieurs livreurs factices
const generateFakeData = async () => {
  for (let i = 0; i < 10; i++) { // Modifier le nombre pour générer plus ou moins de livreurs
    await createFakeLivreur();
  }
  mongoose.connection.close(); // Fermer la connexion après avoir terminé
};

generateFakeData();
