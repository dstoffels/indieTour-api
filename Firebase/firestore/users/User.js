const { USERS } = require('../paths.js');

class User {
	constructor(authUser, hasValidPW = false) {
		const { email, displayName, emailVerified } = authUser;
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
