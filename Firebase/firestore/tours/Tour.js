const { TOURS, getPath } = require('../paths.js');

class Tour {
	constructor(bandRef, tourData, isPerpetual = false) {
		const { name, notes, startDate, endDate, numDates } = tourData;
		this.ref = bandRef.collection(TOURS).doc();
		this.data = {
			name,
			notes,
			startDate,
			endDate,
			numDates,
			isPerpetual,
			isArchived: false,
			path: getPath(this.ref),
		};
	}
}

module.exports = { Tour };
