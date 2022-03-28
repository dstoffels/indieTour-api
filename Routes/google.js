const { default: axios } = require('axios');
const { GOOGLE_API_KEY } = require('../apiKeys.js');

const placesURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${GOOGLE_API_KEY}&query=`;

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const searchplaces = async (req, res) => {
	try {
		const { search } = req.params;
		const response = await axios.get(placesURL + search);
		res.send(response.data);
	} catch (error) {
		res.status(400).send(error);
	}
};

module.exports = function (app) {
	app.get('/places/:search', searchplaces);
};
