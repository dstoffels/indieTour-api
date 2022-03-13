const { auth, firebaseAuth } = require('../firebase.js');
const usersAPI = require('../firestore/users/usersAPI.js');
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

exports.createEmailUser = async ({ email, password, displayName }) => {
	const newUserCredentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
	await sendEmailVerification(newUserCredentials.user);
	await updateProfile(newUserCredentials.user, { displayName });
	const user = await usersAPI.createUser(
		{ body: { hasValidPW: password === 'password' ? false : true } },
		newUserCredentials.user,
	);
	return user;
};

exports.emailLogin = async ({ email, password }) => {
	const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
	return generateAuthData(userCredentials);
};

exports.getAuthorizedUser = async token => {
	const initUserData = await auth.verifyIdToken(token);
	return {
		...initUserData,
		displayName: initUserData.name,
		emailVerified: initUserData.email_verified,
	};
};

// AUTHORIZATION
exports.authorize = APIfn => async request => {
	const authUser = await this.getAuthorizedUser(request.headers.auth);
	return await APIfn(request, authUser);
};
