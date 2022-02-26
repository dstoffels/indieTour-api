const axios = require('axios');
const rest = require('../firebaseAPI.js');
const { firebase } = require('../firebase.js');
const auth = firebase.auth();

//**Destructures vital info from user's data */
const userInfo = user => {
	const { uid, email, displayName, emailVerified, idToken, refreshToken } = user;
	return { uid, email, displayName, emailVerified, token: { idToken, refreshToken } };
};

exports.createEmailUser = async ({ email, password, displayName }) => {
	await auth.createUser({ email, password, displayName });
	return await this.emailLogin({ email, password });
};

exports.emailLogin = async body => {
	const response = await axios.post(rest.signInWithPassword, {
		...body,
		returnSecureToken: true,
	});
	const user = await auth.getUser(response.data.localId);
	return userInfo({ ...response.data, ...user });
};
