const { default: axios } = require('axios');
const { GOOGLE_API_KEY } = require('../apiKeys.js');

const placesURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${GOOGLE_API_KEY}&query=`;

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const searchplaces = async (req, res) => {
	const { search } = req.params;
	const response = await axios.get(placesURL + search);
	console.log('pinged google places');
	res.send(response.data);
};

module.exports = function (app) {
	app.get('/places/:search', searchplaces);
};
