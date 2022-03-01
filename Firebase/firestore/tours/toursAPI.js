const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { pathBldr, BANDS, TOURS, getPath, bandToursPath } = require('../paths.js');

exports.createTour = async (request, authUser) => {
	const { bandId } = request.params;
	const tour = request.body;
	const toursRef = firestore.collection(bandToursPath(bandId));
	const newTourRef = toursRef.doc();

	return await firestore.runTransaction(async t => {
		const tours = await t.get(toursRef);

		//validate tour name
		validateUniqueNameInCollection(tours.docs, tour.name, 'tour');

		t.set(newTourRef, tour);

		return { message: `Created tour: ${tour.name}` };
	});
};

exports.getAllTours = async (bandId, res) => {
	const tours = await fetchTours(bandId);
	res.send(tours);
};
