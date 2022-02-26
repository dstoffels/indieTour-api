const admin = require('firebase-admin');
const serviceAccount = require('./privateKey.json');

const firebase = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://indietour-9bf7b-default-rtdb.firebaseio.com',
});

const firestore = firebase.firestore();

module.exports = { firebase, firestore };
