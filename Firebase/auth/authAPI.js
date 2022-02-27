const { auth, firebaseAuth } = require('../firebase.js');
const {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
} = require('firebase/auth');

// authentication utilize the firebase SDK,
// authorization is handled by firebase-admin SDK

// AUTHENTICATION
const generateAuthData = userCredentials => {
	const { uid, email, emailVerified, displayName, stsTokenManager } = userCredentials.user;
	return { uid, email, emailVerified, displayName, token: stsTokenManager };
};

// TODO: if pw === 'password', force user to change before logging in
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

/// TODO: turn this into a wrapper/decorator?
// exports.authorize = async request => {};

exports.authorize = APIfn => async request => {
	const decodedToken = await auth.verifyIdToken(request.headers.auth);
	const uid = decodedToken.uid;
	return await APIfn(request, uid);
};
