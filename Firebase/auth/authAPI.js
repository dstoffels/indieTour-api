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

const placeholderName = email => {
	const i = email.indexOf('@');
	return email.slice(0, i);
};

const createEmailUser = async ({ email, password, displayName }) => {
	const newUserCredentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
	await sendEmailVerification(newUserCredentials.user);
	await updateProfile(newUserCredentials.user, {
		displayName: displayName || placeholderName(email),
	});

	const user = await usersAPI.createUser({
		body: {
			...newUserCredentials.user,
			hasValidPW: password === 'password' ? false : true,
		},
	});
	return user;
};

const emailLogin = async ({ email, password }) => {
	const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
	return generateAuthData(userCredentials);
};

class AuthUser {
	constructor(userData) {
		const { uid, email, email_verified, name } = userData;
		this.uid = uid;
		this.email = email;
		this.displayName = name;
		this.emailVerified = email_verified;
	}
}

/**
 *
 * @param {*} token
 * @returns
 */
getAuthorizedUser = async token => {
	const initUserData = await auth.verifyIdToken(token);
	return new AuthUser(initUserData);
};

// AUTHORIZATION
authorize = APIfn => async request => {
	const authUser = await getAuthorizedUser(request.headers.auth);
	return await APIfn(request, authUser);
};

module.exports = { AuthUser, getAuthorizedUser, createEmailUser, emailLogin, authorize };
