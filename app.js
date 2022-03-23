const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// setup express app
const app = express();

const port = 3002;

// MIDDLEWARE
const json = bodyParser.json();
app.use(json);

app.use(cors());

// app.use(function (req, res, next) {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// 	next();
// });

app.listen(port, () => {
	console.log(`indieTour listening on port ${port}`);
});

require('./Routes/auth.js')(app);
require('./Routes/bands.js')(app);
require('./Routes/users.js')(app);
require('./Routes/members.js')(app);
require('./Routes/tours.js')(app);
require('./Routes/google.js')(app);

module.exports = app;
