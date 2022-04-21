const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// setup express app
const app = express();

const PORT = 3000;

// MIDDLEWARE
const json = bodyParser.json();
app.use(json);

app.use(cors());

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

require('./Routes/auth.js')(app);
require('./Routes/bands.js')(app);
require('./Routes/users.js')(app);
require('./Routes/members.js')(app);
require('./Routes/tours.js')(app);
require('./Routes/google.js')(app);

module.exports = app;
