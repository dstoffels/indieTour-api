const { DATES, getPath } = require('../paths.js');

class Date {
	constructor(tourRef, reqBody) {
		this.ref = tourRef.collection(DATES).doc();
		this.data = {
			...reqBody,
			path: getPath(this.ref),
		};
	}
}

module.exports = Date;
