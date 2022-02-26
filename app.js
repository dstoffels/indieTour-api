const express = require('express');
const bodyParser = require('body-parser');
const json = bodyParser.json();
const userAPI = require('./Firebase/userAPI.js');
const bandsAPI = require('./Firebase/firestore/bandsAPI.js');
const toursAPI = require('./Firebase/firestore/toursAPI.js');

const app = express();
const port = 3002;

// AUTH
app.post('/auth/new-user', json, (req, res) => {
	userAPI.createEmailUser(req.body, res);
});

app.post('/auth/login', json, (req, res) => {
	userAPI.emailLogin(req.body, res);
});

// BANDS
app.post('/bands/new', json, (req, res) => {
	bandsAPI.createBand(req.body, res);
});

app.delete('/bands/:bandId/delete', json, (req, res) => {
	bandsAPI.deleteBand(req.params.bandId, res);
});

// TOURS
app.post(`/bands/:bandId/tours/new`, json, (req, res) => {
	toursAPI.createTour(req.params.bandId, req.body, res);
});

app.get('/bands/:bandId/tours', (req, res) => {
	toursAPI.getAllTours(req.params.bandId, res);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
