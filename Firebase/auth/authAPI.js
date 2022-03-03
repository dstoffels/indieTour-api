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
	return { user: { uid, email, emailVerified, displayName }, token: stsTokenManager.accessToken };
};

// TODO: if pw === 'password', force user to change before logging in??
exports.createEmailUser = async ({ email, password, displayName }) => {
	const newUserCredentials = await createUserWithEmailAndPassword(auth, email, password);
	await sendEmailVerification(newUserCredentials.user);
	await updateProfile(newUserCredentials.user, { displayName });
	return generateAuthData(newUserCredentials);
};

exports.emailLogin = async ({ email, password }) => {
	const userCredentials = await signInWithEmailAndPassword(auth, email, password);
	return generateAuthData(userCredentials);
};

exports.getAuthorizedUser = async token => await auth.verifyIdToken(token);

// AUTHORIZATION
exports.authorize = APIfn => async request => {
	const authUser = await this.getAuthorizedUser(request.headers.auth);
	return await APIfn(request, authUser);
};
