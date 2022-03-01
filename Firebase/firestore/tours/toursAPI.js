const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { bandToursPath, bandPath, TOURS, tourPath } = require('../paths.js');
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

		return { message: `Created tour: ${name}` };
	});
};

exports.getBandTours = async (request, authUser) =>
	await firestore
		.collection(bandToursPath(request.params.bandId))
		.get()
		.then(tours => tours.docs.map(tour => tour.data()));

exports.editTour = async (request, authUser) => {
	const { bandId, tourId } = request.params;
	const tour = request.body;
	const tourRef = firestore.doc(tourPath(bandId, tourId));
	await tourRef.update(tour);
	return { message: `Updated tour: ${tour.name}` };
};
