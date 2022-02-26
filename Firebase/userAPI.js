const axios = require('axios');
const rest = require('./firebaseAPI.js');
const { firebase } = require('./firebase.js');
const auth = firebase.auth();

//**Destructures vital info from user's data */
const userInfo = user => {
	const { uid, email, displayName, emailVerified, idToken, refreshToken } = user;
	return { uid, email, displayName, emailVerified, token: { idToken, refreshToken } };
};

exports.createEmailUser = (body, res) => {
	const { email, password, displayName } = body;
	auth
		.createUser({ email, password, displayName })
		.then(newUser => {
			auth
				.generateEmailVerificationLink(email)
				.then(link => res.send(link))
				.catch(err => res.send(err));
			this.emailLogin(body, res);
		})
		.catch(err => res.send(err));
};

exports.emailLogin = (body, res) => {
	axios
		.post(rest.signInWithPassword, { ...body, returnSecureToken: true })
		.then(response => {
			const uid = response.data.localId;
			auth.getUser(uid).then(user => res.send(userInfo({ ...response.data, ...user })));
		})
		.catch(err => res.send(err));
};
