const express = require('express');
const bodyParser = require('body-parser');
const userAPI = require('./Firebase/auth/userAPI.js');
const bandsAPI = require('./Firebase/firestore/bandsAPI.js');
const toursAPI = require('./Firebase/firestore/toursAPI.js');

const app = express();
const json = bodyParser.json();
app.use(json);
const port = 3002;

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

// AUTH
app.post('/auth/new-user', async (req, res) => {
	try {
		const newUser = await userAPI.createEmailUser(req.body);
		res.send(newUser);
	} catch (error) {
		res.status(400).json(error);
	}
});

app.post('/auth/login', async (req, res) => {
	try {
		const user = await userAPI.emailLogin(req.body);
		res.send(user);
	} catch {
		res.status(400).json({ message: 'Incorrect email/password' });
	}
});

// BANDS
app.post('/bands/new', async (req, res) => {
	try {
		const band = await bandsAPI.createBand(req.body);
		res.send(band);
	} catch {
		res.status(400).json('What did you do, Richard?');
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
	} catch (error) {
		res.status(400).json(error);
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

// TOURS
app.post(`/bands/:bandId/tours/new`, async (req, res) => {
	toursAPI.createTour(req.params.bandId, req.body, res);
});

app.get('/bands/:bandId/tours', async (req, res) => {
	toursAPI.getAllTours(req.params.bandId, res);
});
