const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { bandToursPath, bandPath, TOURS, tourPath, MEMBERS, BANDS } = require('../paths.js');
const { Tour } = require('./Tour.js');

exports.createTour = async (request, authUser) => {
	const { bandId } = request.params;
	const { name, notes } = request.body;
	const bandRef = firestore.doc(bandPath(bandId));

	return await firestore.runTransaction(async t => {
		const tours = await t.get(bandRef.collection(TOURS));

		validateUniqueNameInCollection(tours.docs, name, 'tour');

		const newTour = new Tour(bandRef, name, notes);
		t.set(newTour.ref, newTour.data);

		return newTour.data;
	});
};

exports.getBandTours = async (request, authUser) =>
	await firestore
		.collection(bandToursPath(request.params.bandId))
		.get()
		.then(tours => tours.docs.map(tour => tour.data()));

exports.editTour = async (request, authUser) => {
	const { bandId, tourId } = request.params;
	const tourData = request.body;
	return await firestore.runTransaction(async t => {
		const tourRef = firestore.doc(tourPath(bandId, tourId));
		const tour = await t.get(tourRef);
		t.update(tourRef, tourData);
		return tour.data();
	});
};

exports.deleteTour = async (request, authUser) => {
	const { bandId, tourId } = request.params;

	const tourRef = firestore.doc(tourPath(bandId, tourId));
	const bandToursRef = firestore.collection(bandToursPath(bandId));

	await firestore.runTransaction(async t => {
		const tours = await t.get(bandToursRef);

		// get dates from tour
		// get all timeslots from dates
		// delete all timeslots
		// delete all dates

		t.delete(tourRef);
		// return tours.docs.map(doc => doc.data());
	});
	return await bandToursRef.get().then(snap => snap.docs.map(doc => doc.data()));
};
