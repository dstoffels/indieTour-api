const { authorize } = require('../Firebase/auth/authAPI.js');
const bandsAPI = require('../Firebase/firestore/bands/bandsAPI.js');

module.exports = function (app) {
	app.get('/bands', async (req, res) => {
		try {
			const userBands = await authorize(bandsAPI.getUserBands)(req);
			res.send(userBands);
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	});

	app.post('/bands/new', async (req, res) => {
		try {
			const band = await authorize(bandsAPI.createBand)(req);
			res.send(band);
		} catch (error) {
			// console.log(error);
			res.status(400).json(error);
		}
	});

	app.get('/bands/:bandId', async (req, res) => {
		try {
			const band = await bandsAPI.selectBand(req.params.bandId);
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
			res.status(204).json();
		} catch {
			res.status(400).json({ message: 'Band not found.' });
		}
	});
};
