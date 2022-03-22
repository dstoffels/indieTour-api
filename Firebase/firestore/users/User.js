const { firestore } = require('../../firebase.js');
const { USERS, getPath } = require('../paths.js');

class User {
	constructor(userData) {
		this.ref = firestore.collection(USERS).doc();
		const { email, displayName, hasValidPW } = userData;
		this.data = {
			displayName,
			email,
			activeMember: null,
			emailVerified: false,
			hasValidPW,
			path: getPath(this.ref),
		};
	}
}

module.exports = { User };
