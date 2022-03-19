const { firestore } = require('../../firebase.js');
const { USERS, getPath } = require('../paths.js');

class User {
	constructor(authUser, hasValidPW = false) {
		this.ref = firestore.collection(USERS).doc();
		const { email, displayName, emailVerified } = authUser;
		this.data = {
			displayName,
			email,
			activeTour: null,
			activeMember: null,
			emailVerified,
			hasValidPW,
			path: getPath(this.ref),
		};
	}
}

module.exports = { User };
