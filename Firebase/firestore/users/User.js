const { USERS } = require('../paths.js');

class User {
	constructor(authUser, requiresNewPW = true) {
		const { uid } = authUser;
		this.data = {
			uid,
			currentTour: null,
			currentMember: null,
			requiresNewPW,
		};
	}
}

module.exports = { User };
