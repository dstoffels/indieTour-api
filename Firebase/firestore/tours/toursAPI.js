const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { bandToursPath } = require('../paths.js');

exports.createTour = async (request, authUser) => {
	const { bandId } = request.params;
	const tour = request.body;
	const toursRef = firestore.collection(bandToursPath(bandId));
	const newTourRef = toursRef.doc();

	return await firestore.runTransaction(async t => {
		const tours = await t.get(toursRef);

		validateUniqueNameInCollection(tours.docs, tour.name, 'tour');

		t.set(newTourRef, tour);

		return { message: `Created tour: ${tour.name}` };
	});
};

exports.getAllTours = async (request, authUser) =>
	await firestore
		.collection(bandToursPath(request.params.bandId))
		.get()
		.then(tours => tours.docs.map(tour => tour.data()));
