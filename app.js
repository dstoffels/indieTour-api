const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const json = bodyParser.json();
app.use(json);
const port = 3002;

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

require('./Routes/auth.js')(app);
require('./Routes/bands.js')(app);
require('./Routes/tours.js')(app);
