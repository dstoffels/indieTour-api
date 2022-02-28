const { auth, firebaseAuth, firestore } = require('../firebase.js');
const {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
} = require('firebase/auth');

// authentication utilizes the firebase SDK,
// authorization is handled by firebase-admin SDK

// AUTHENTICATION
const generateAuthData = userCredentials => {
	const { uid, email, emailVerified, displayName, stsTokenManager } = userCredentials.user;
	return { uid, email, emailVerified, displayName, token: stsTokenManager };
};

// TODO: if pw === 'password', force user to change before logging in??
exports.createEmailUser = async ({ email, password, name }) => {
	const newUserCredentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
	await sendEmailVerification(newUserCredentials.user);
	await updateProfile(newUserCredentials.user, { displayName: name });
	return generateAuthData(newUserCredentials);
};

exports.emailLogin = async ({ email, password }) => {
	const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
	return generateAuthData(userCredentials);
};

exports.decodeToken = async token => {
	const decodedToken = await auth.verifyIdToken(token);
	return decodedToken.uid;
};

// AUTHORIZATION
exports.authorize = APIfn => async request => {
	const uid = decodeToken(request.headers.auth);
	return await APIfn(request, uid);
};
