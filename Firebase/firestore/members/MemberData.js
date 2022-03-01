const { getPath } = require('../paths.js');

class MemberData {
	constructor(id, user, member, bandRef, bandName) {
		this.uid = user.uid;
		this.email = user.email;
		this.displayName = user.displayName;
		this.role = member.role;
		this.bandId = bandRef.id;
		this.bandName = bandName;
		this.bandPath = getPath(bandRef);
	}
}

module.exports = MemberData;
