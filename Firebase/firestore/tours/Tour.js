const { TOURS, getPath } = require('../paths.js');

const defaultData = {
	name: 'General Tour',
	notes: 'For rogue tour dates, one-offs or laziness :)',
	startDate: '',
	endDate: '',
	numDates: 0,
};

class Tour {
	constructor(bandRef, tourData = defaultData) {
		const { name, notes, startDate, endDate, numDates } = tourData;
		this.ref = bandRef.collection(TOURS).doc();
		this.data = {
			name,
			notes,
			startDate,
			endDate,
			numDates,
			isPerpetual: tourData === defaultData ? true : false,
			isArchived: false,
			path: getPath(this.ref),
		};
	}
}

module.exports = { Tour };
