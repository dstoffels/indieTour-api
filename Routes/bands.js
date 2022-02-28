const { authorize } = require('../Firebase/auth/authAPI.js');
const { authorizeOwner } = require('../Firebase/firestore/bands/bandAuth.js');
const bandsAPI = require('../Firebase/firestore/bands/bandsAPI.js');

module.exports = function (app) {
	app.get('/bands', async (req, res) => {
		try {
			const userBands = await authorize(bandsAPI.getUserBands)(req);
			res.send(userBands);
		} catch (error) {
			res.send(error);
		}
	});

	app.post('/bands/new', async (req, res) => {
		try {
			const band = await authorize(bandsAPI.createBand)(req);
			res.send(band);
		} catch (error) {
			res.status(400).json(error);
		}
	});

	app.put('/bands/:bandId', async (req, res) => {
		try {
			const updatedBand = await authorizeOwner(bandsAPI.editBand)(req);
			res.send(updatedBand);
		} catch (error) {
			console.log(error);
			res.send(error);
		}
	});

	app.delete('/bands/:bandId/delete', async (req, res) => {
		try {
			await authorizeOwner(bandsAPI.deleteBand)(req);
			res.status(204).json();
		} catch {
			res.status(400).json({ message: 'Band not found.' });
		}
	});
};
