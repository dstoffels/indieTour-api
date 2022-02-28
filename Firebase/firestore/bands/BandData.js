const { getPath } = require('../paths.js');

class BandData {
	constructor(band, member) {
		this.id = band.id;
		this.name = band.data().name;
		this.memberRole = member.role;
		this.path = getPath(band.ref);
	}
}

module.exports = BandData;
