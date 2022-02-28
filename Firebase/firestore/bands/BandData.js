const { getPath } = require('../paths.js');

class BandData {
	constructor(bandSnap, member) {
		this.id = bandSnap.id;
		this.name = bandSnap.data().name;
		this.memberRole = member.role;
		this.path = getPath(bandSnap.ref);
	}
}

module.exports = BandData;
