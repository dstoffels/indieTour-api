const { firestore } = require('../../firebase.js');
const { pathBldr, BANDS, TOURS, getPath } = require('../paths.js');

const fetchTours = async bandId => {
	const tours = await firestore.collection(pathBldr(BANDS, bandId, TOURS)).get();
	return tours.docs.map(doc => doc.data());
};

exports.createTour = async (bandId, tourData) => {
	const tours = await fetchTours(bandId);
	if (tours.find(tour => tour.name === tourData.name)) {
		throw { message: 'A tour of that name already exists' };
	} else {
		const bandTours = firestore.collection(pathBldr(BANDS, bandId, TOURS));
		const tourDoc = await bandTours.add(tourData);
		return getPath(tourDoc);
	}
};

exports.getAllTours = async (bandId, res) => {
	const tours = await fetchTours(bandId);
	res.send(tours);
};
