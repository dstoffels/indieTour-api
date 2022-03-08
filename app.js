const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const json = bodyParser.json();
app.use(json);
const port = 3002;

app.use(cors());

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.listen(port, () => {
	console.log(`indieTour listening on port ${port}`);
});

require('./Routes/auth.js')(app);
require('./Routes/bands.js')(app);
require('./Routes/members.js')(app);
require('./Routes/tours.js')(app);
