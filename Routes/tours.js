const { createTour, getAllTours } = require('../Firebase/firestore//tours/toursAPI.js');
const {
	authorizeRoles,
	ADMIN_ROLES,
	ALL_ROLES,
} = require('../Firebase/firestore/bands/bandAuth.js');

module.exports = function (app) {
	app.post(`/bands/:bandId/tours/new`, async (req, res) => {
		try {
			const newTour = await authorizeRoles(createTour, ADMIN_ROLES)(req);
			res.send(newTour);
		} catch (error) {
			res.status(400).json(error);
		}
	});

	app.get('/bands/:bandId/tours', async (req, res) => {
		try {
			const tours = await authorizeRoles(getAllTours, ALL_ROLES)(req);
			res.send(tours);
		} catch (error) {
			res.status(400).send(error);
		}
	});
};
