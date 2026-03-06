// backend/src/firebase.js
const admin = require('firebase-admin');
require('dotenv').config();

// Inicializa o Admin SDK com as variaveis de ambiente
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // O replace corrige o escape das quebras de linha na string da chave
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };