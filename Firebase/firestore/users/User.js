const { USERS } = require('../paths.js');

class User {
	constructor(authUser, hasValidPW = false) {
		const { displayName, email, emailVerified } = authUser;
		this.data = {
			displayName,
			email,
			activeTour: null,
			activeMember: null,
			emailVerified,
			hasValidPW,
		};
	}
}

module.exports = { User };
