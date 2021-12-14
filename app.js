require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./model/user');
const auth = require('./middleware/auth');

const app = express();

app.use(express.json({ limit: '50mb' }));

app.post('/register', async (req, res) => {
  try {
    // Récupération des informations passé dans le body de la requête
    const { first_name, last_name, email, password } = req.body;

    // Vérification de l'existance des datas récupérées
    if (!(email && password && first_name && last_name)) {
      res
        .status(400)
        .send(
          "Vous n'avez pas fournis l'ensemble des informations nécessaires !!!"
        );
    }

    // On vérifie si l'email existe déjà dans la bdd
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res
        .status(409)
        .send('Vous êtes déjà enregistré, veuillez vous connecter !!!');
    }

    //On hash le mot de passe
    encryptPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptPassword,
    });

    // On génère un nouveau token via la variable d'environnement
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '3600s', //Validité du token sur 1 heure
      }
    );
    // On sauvegarde le token dans user
    user.token = token;

    // On renvoi l'utilisateur
    res.status(201).json(user);
  } catch (err) {
    console.log(err); //Si une erreur est levé ont la renvoie en console
  }
});

//Login
app.post('/login', async (req, res) => {
  try {
    // recupération de l'email et du password depuis le body de la requête
    const { email, password } = req.body;

    // Vérification des datas récupérées
    if (!(email && password)) {
      res
        .status(400)
        .send("Vous n'avez pas indiquez d'email ni de mot de passe");
      return;
    }
    // On vérifie que l'email est bien présent dans la db
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('Votre email et mot de passe ne sont pas valides !!!');
      // Création du token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      );

      // on garde le token dans user
      user.token = token;

      // envoi de user en réponse 200
      res.status(200).json(user);
      return;
    } else {
      //On renvoi un 400 si les infos ne sont pas valides.
      res.status(400).send('Les informations ne sont pas valides !!!');
      return;
    }
  } catch (err) {
    console.log(err); //On renvoi l'erreur
  }
});

//Route hello pour un message personnalisé. Celle-ci a besoin de : email, password et d'un token valide (à générer avec un login)
app.get('/hello', auth, async (req, res) => {
  const { email, password } = req.body; //on récupère l'email et le password
  if (email) {
    const user = await User.findOne({ email });
    console.log(req.body);
    if (await bcrypt.compare(password, user.password)) {
      res.status(200).send(`Hello ${email.split('@')[0]} !!!!  `); //On renvoi un message personnalisé
      return;
    } else {
      res.status(400).send("Votre mot de passe n'est pas valides !!!");
    }
  } else {
    res.status(400).send("Votre email n'est pas valides !!!");
  }
});

// Toutes les autres routes renveront un 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: 404,
      message: "La requête vers cette route n'est pas disonible",
    },
  });
});

module.exports = app;
