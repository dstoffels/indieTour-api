const {
	createTour,
	getBandTours,
	editTour,
	deleteTour,
} = require('../Firebase/firestore//tours/toursAPI.js');
const {
	authorizeRoles,
	ADMIN_ROLES,
	ALL_ROLES,
} = require('../Firebase/firestore/bands/bandAuth.js');
const responseErrorHandler = require('../utils/responseErrorHandler.js');

module.exports = function (app) {
	app.post(`/bands/:bandId/tours`, async (req, res) => {
		responseErrorHandler(res, async () => {
			const newTour = await authorizeRoles(createTour, ADMIN_ROLES)(req);
			res.send(newTour);
		});
	});

	app.get('/bands/:bandId/tours', async (req, res) => {
		responseErrorHandler(res, async () => {
			const tours = await authorizeRoles(getBandTours, ALL_ROLES)(req);
			res.send(tours);
		});
	});

	app.put('/bands/:bandId/tours/:tourId', async (req, res) => {
		responseErrorHandler(res, async () => {
			const updatedTour = await authorizeRoles(editTour, ADMIN_ROLES)(req);
			res.send(updatedTour);
		});
	});

	app.delete('/bands/:bandId/tours/:tourId', async (req, res) => {
		responseErrorHandler(res, async () => {
			const tours = await authorizeRoles(deleteTour, ADMIN_ROLES)(req);
			res.send(tours);
		});
	});
};
