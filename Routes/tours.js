const { createTour } = require('../Firebase/firestore//tours/toursAPI.js');
const { authorizeRoles, ADMIN_ROLES } = require('../Firebase/firestore/bands/bandAuth.js');

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
		toursAPI.getAllTours(req.params.bandId, res);
	});
};
