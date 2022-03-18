const { getPath, MEMBERS } = require('../paths.js');

class Member {
	constructor(bandRef, user, member, bandName, tour) {
		this.ref = bandRef.collection(MEMBERS).doc();
		this.data = {
			path: getPath(this.ref),
			email: user.email,
			displayName: user.displayName || '',
			role: member.role,
			bandId: bandRef.id,
			bandName,
			bandPath: getPath(bandRef),
			activeTour: tour.data,
		};
	}
}

module.exports = { Member };
