const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const config = require('./firebase.config.js');
const serviceAccount = require('./privateKey.json');

const firebaseAdmin = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://indietour-9bf7b-default-rtdb.firebaseio.com',
});

const auth = firebaseAdmin.auth();
const firestore = firebaseAdmin.firestore();

const firebaseApp = initializeApp(config);
const firebaseAuth = getAuth(firebaseApp);

module.exports = { auth, firestore, firebaseAuth };
