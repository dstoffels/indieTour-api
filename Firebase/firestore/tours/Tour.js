const { TOURS } = require('../paths.js');

class Tour {
	constructor(bandRef, name, notes, isPerpetual = false) {
		this.ref = bandRef.collection(TOURS).doc();
		this.data = {
			name,
			notes,
			isPerpetual,
			isArchived: false,
		};
	}
}

module.exports = { Tour };
