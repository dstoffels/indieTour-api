const { firestore } = require('../../firebase.js');
const TourDate = require('../dates/TourDate.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { bandToursPath, bandPath, TOURS, tourPath, tourDatesPath, DATES } = require('../paths.js');
const { generateTourObj } = require('./helpers.js');
const { Tour } = require('./Tour.js');

/**
 *
 * @param {import('express').Request} request
 * @param {AuthorizedUser} authUser
 * @returns
 */
exports.createTour = async (request, authUser) => {
	const { bandId } = request.params;
	const { dates } = request.body;
	const tourData = request.body;

	const bandRef = firestore.doc(bandPath(bandId));
	const newTourRef = await firestore.runTransaction(async t => {
		const tours = await t.get(bandRef.collection(TOURS));

		validateUniqueNameInCollection(tours.docs, tourData.name, 'tour');

		const newTour = new Tour(bandRef, tourData);
		t.set(newTour.ref, newTour.data);

		dates.forEach(date => {
			const newDate = new TourDate(newTour.ref, date);
			t.set(newDate.ref, newDate.data);
		});

		return newTour.ref;
	});

	// return new tour obj w dates array
	return await generateTourObj(newTourRef);
};

/**
 *
 * @param {import('express').Request} request
 * @param {AuthorizedUser} authUser
 * @returns
 */
exports.getBandTours = async (request, authUser) => {
	const tourDocs = await firestore.collection(bandToursPath(request.params.bandId)).listDocuments();
	return await Promise.all(tourDocs.map(async tourRef => await generateTourObj(tourRef)));
};

/**
 *
 * @param {import('express').Request} request
 * @param {AuthorizedUser} authUser
 * @returns
 */
exports.editTour = async (request, authUser) => {
	const { bandId, tourId } = request.params;
	const { dates } = request.body;
	const tourData = request.body;
	delete tourData.dates;

	const tourRef = firestore.doc(tourPath(bandId, tourId));
	const tourDatesRef = firestore.collection(tourDatesPath(bandId, tourId));

	await firestore.runTransaction(async t => {
		const tourDatesSnap = await t.get(tourDatesRef);

		// does date exist in tour dates

		// compare incoming tourDates [],
		// update if the current date exists in incoming dates, delete if not
		const curTourDates = tourDatesSnap.docs.map(doc => {
			const curTourDate = doc.data();
			const newTourDate = dates.find(tourDate => curTourDate.date === tourDate.date);

			Boolean(newTourDate) ? t.update(doc.ref, newTourDate) : t.delete(doc.ref);
			return curTourDate;
		});

		// Add new tourDates
		for (let i = 0; i < dates.length; i++) {
			const curTourDate = curTourDates.find(tourDate => dates[i].date === tourDate.date);
			if (!curTourDate) {
				const newTourDate = new TourDate(tourRef, dates[i]);
				t.set(newTourDate.ref, newTourDate.data);
			}
		}

		t.update(tourRef, tourData);
	});

	// return updated tour obj with dates array
	return await generateTourObj(tourRef);
};

/**
 *
 * @param {import('express').Request} request
 * @param {AuthorizedUser} authUser
 * @returns
 */
exports.deleteTour = async (request, authUser) => {
	const { bandId, tourId } = request.params;

	const tourRef = firestore.doc(tourPath(bandId, tourId));
	const tourDatesRefs = tourRef.collection(DATES);

	await firestore.runTransaction(async t => {
		const tourDatesDocs = await t.get(tourDatesRefs);

		// delete all timeslots

		// delete all dates
		tourDatesDocs.docs.forEach(doc => t.delete(doc.ref));
		// delete tour
		t.delete(tourRef);
	});

	// return updated tours array
	return await this.getBandTours(request, authUser);
};
