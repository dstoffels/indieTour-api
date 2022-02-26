const { auth, firebaseAuth } = require('../firebase.js');
const {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
} = require('firebase/auth');

const generateUserData = userCredentials => {
	const { email, emailVerified, displayName, stsTokenManager } = userCredentials.user;
	return { email, emailVerified, displayName, token: stsTokenManager };
};

exports.createEmailUser = async ({ email, password, username }) => {
	const newUserCredentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
	// await sendEmailVerification(newUserCredentials.user);
	await updateProfile(newUserCredentials.user, { displayName: username });
	return generateUserData(newUserCredentials);
};

exports.emailLogin = async ({ email, password }) => {
	const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
	return generateUserData(userCredentials);
};
