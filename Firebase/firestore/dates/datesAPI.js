const { AuthUser } = require('../../auth/authAPI.js');
const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { tourPath, DATES, tourDatesPath } = require('../paths.js');
const { Tour } = require('../tours/Tour.js');
const Date = require('./Date.js');

/**
 * Util for updating a tour when creating/deleting dates from it.
 * @param {*} t firestore transaction
 * @param {FirebaseFirestore.DocumentSnapshot} tour
 * @param {FirebaseFirestore.QuerySnapshot} dates
 */
exports.incOrDecTourDatesInfo = (t, tour, dates) => {
	dates = dates.map(doc => doc.data());
	// TODO: find earliest date and set tour.startDate
	// TODO: find latest data and set tour.endDate
	t.update(tour.ref, { numDates: dates.docs.length });
};

/**
 *
 * @param {import("express").Request} request
 * @body date, type, title, location, deal, notes, isConfirmed
 * @param {AuthUser} authUser
 */
exports.createDate = async (request, authUser) => {
	const { bandId, tourId } = request.params;
	const { date } = request.body;
	const tourRef = firestore.doc(tourPath(bandId, tourId));

	return await firestore.runTransaction(async t => {
		const dates = await t.get(tourRef.collection(DATES));
		const tour = await t.get(tourRef);

		validateUniqueNameInCollection(dates.docs, date, 'date');

		const newDate = new Date(tourRef, request.body);
		t.set(newDate.ref, newDate.data);

		// update tour with start/end dates & numDates
		this.incOrDecTourDatesInfo(t, tour, dates);

		return newDate.data;
	});
};

/**
 *
 * @param {import("express").Request} request
 * @param {AuthUser} authUser
 */
exports.getTourDates = async (request, authUser) => {
	const { bandId, tourId } = request.params;
	return await firestore
		.collection(tourDatesPath(bandId, tourId))
		.get()
		.then(dates => dates.docs.map(date => date.data()));
};

/**
 *
 * @param {import('express').Request} request
 * @param {AuthUser} authUser
 */
exports.updateDate = async (request, authUser) => {
	const { bandId, tourId } = request.params;
};

/**
 *
 * @param {import('express').Request} request
 * @param {AuthUser} authUser
 */
exports.deleteDate = async (request, authUser) => {};
