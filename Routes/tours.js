const toursAPI = require('../Firebase/firestore/toursAPI.js');

module.exports = function (app) {
	app.post(`/bands/:bandId/tours/new`, async (req, res) => {
		try {
			const newTour = await toursAPI.createTour(req.params.bandId, req.body);
			res.send(newTour);
		} catch (error) {
			res.status(400).json(error);
		}
	});

	app.get('/bands/:bandId/tours', async (req, res) => {
		toursAPI.getAllTours(req.params.bandId, res);
	});
};
