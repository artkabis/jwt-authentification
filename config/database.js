const mongoose = require('mongoose');

const { MONGO_URI } = process.env;
const options = {
  autoIndex: false, // Aucun index sera créé est auto-indexé
  maxPoolSize: 10, // max 10 sockets pour la connexion
  serverSelectionTimeoutMS: 4000, // Les tentatives de reconnexion au serveur doivent être espacées de 4 secondes
  socketTimeoutMS: 45000, // Fermeture des sokets après 60 secondes d'inactivité
  family: 4, // Utilisation de l'IPv4 en cas d'échec, sur l'IPv6
};
exports.connect = () => {
  // Connexion à la bdd
  mongoose
    .connect(MONGO_URI, options) //On récupère l'url de la db via la notre variable d'environnement
    .then(() => {
      console.log('Connexion à la base de données réussi !!!');
    })
    .catch((error) => {
      console.log('La connexion à la base de données a échoué !!!');
      console.error(error); //On renvoi l'erreur
      process.exit(1);
    });
};
