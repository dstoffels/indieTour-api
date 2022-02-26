const { firestore } = require('../firebase.js');
const { pathBldr, BANDS, TOURS, getPath } = require('./paths.js');

const fetchTours = async bandId => {
	const tours = await firestore.collection(pathBldr(BANDS, bandId, TOURS)).get();
	return tours.docs.map(doc => doc.data());
};

exports.createTour = async (bandId, { name, startDate, endDate }, res) => {
	const tours = await fetchTours(bandId);
	if (tours.filter(tour => tour.name === name).length) {
		res.status(400).json({ error: 'A tour of that name already exists' });
	} else {
		const bandTours = firestore.collection(pathBldr(BANDS, bandId, TOURS));
		bandTours.add({ name, startDate, endDate }).then(doc => {
			res.send(getPath(doc));
		});
	}
};

exports.getAllTours = async (bandId, res) => {
	const tours = await fetchTours(bandId);
	res.send(tours);
};
