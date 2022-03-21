const { firestore } = require('../../firebase.js');
const { DATES, getPath } = require('../paths.js');

class TourDate {
	constructor(tourRef, dateObj) {
		this.ref = tourRef.collection(DATES).doc();
		this.data = dateObj;
		this.data.path = getPath(this.ref);
	}
}

module.exports = TourDate;
