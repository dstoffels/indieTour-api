const { auth, firebaseAuth } = require('../firebase.js');
const {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
	signin,
} = require('firebase/auth');
const { default: axios } = require('axios');
const config = require('../firebase.config.js');

// authentication utilize the firebase SDK,
// while authorization is handled by firebase-admin SDK

// AUTHENTICATION
const generateAuthData = userCredentials => {
	const { email, emailVerified, displayName, stsTokenManager } = userCredentials.user;
	return { email, emailVerified, displayName, token: stsTokenManager };
};

exports.createEmailUser = async ({ email, password, username }) => {
	const newUserCredentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
	await sendEmailVerification(newUserCredentials.user);
	await updateProfile(newUserCredentials.user, { displayName: username });
	return generateAuthData(newUserCredentials);
};

exports.emailLogin = async ({ email, password }) => {
	const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
	return generateAuthData(userCredentials);
};

// AUTHORIZATION
exports.authorize = async idtoken => {
	const decodedToken = await auth.verifyIdToken(idtoken);
	return decodedToken.uid;
};

exports.selectBand();
