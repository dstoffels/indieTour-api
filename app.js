const express = require('express');
const bodyParser = require('body-parser');
const json = bodyParser.json();
const user = require('./Firebase/user.js');

const app = express();
const port = 3002;

app.post('/auth/login', json, (req, res) => {
	console.log(req.body);
	user.emailLogin(req.body, res);
});

app.post('/auth/new-user', json, (req, res) => {
	user.createEmailUser(req.body, res);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
