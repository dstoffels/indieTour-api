const bandsAPI = require('../Firebase/firestore/bandsAPI.js');

module.exports = function (app) {
	app.post('/bands/new', async (req, res) => {
		try {
			const band = await bandsAPI.createBand(req.body);
			res.send(band);
		} catch (error) {
			res.status(400).json(error);
		}
	});

	app.get('/bands/:bandId', async (req, res) => {
		try {
			const band = await bandsAPI.getBand(req.params.bandId);
			res.send(band);
		} catch {
			res.status(400).json({ message: 'Band not found.' });
		}
	});

	app.put('/bands/:bandId', async (req, res) => {
		try {
			const band = await bandsAPI.editBand(req.params.bandId, req.body);
			res.send(band);
		} catch {
			res.status(400).json({ message: 'Invalid bandId' });
		}
	});

	app.delete('/bands/:bandId/delete', async (req, res) => {
		try {
			await bandsAPI.deleteBand(req.params.bandId, res);
			res.status(204);
		} catch {
			res.status(400).json({ message: 'Band not found.' });
		}
	});
};
