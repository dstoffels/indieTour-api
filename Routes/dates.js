const app = require('../app.js');
const {
	authorizeRoles,
	ADMIN_ROLES,
	ALL_ROLES,
} = require('../Firebase/firestore/bands/bandAuth.js');
const { createDate, getTourDates } = require('../Firebase/firestore/dates/datesAPI.js');
const responseErrorHandler = require('../utils/responseErrorHandler.js');

/**
 *
 * @param {app} app
 */
module.exports = function (app) {
	app.post('/bands/:bandId/tours/:tourId', async (req, res) => {
		responseErrorHandler(res, () => {
			const newDate = await authorizeRoles(createDate, ADMIN_ROLES)(req);
			res.send(newDate);
		});
	});

	app.get('bands/:bandId/tours/:tourId', async (req, res) => {
		responseErrorHandler(res, () => {
			const dates = await authorizeRoles(getTourDates, ALL_ROLES)(req);
			res.send(dates);
		});
	});

	// create put view
	app.put('bands/:bandId/tours/:tourId/dates/:dateId', async (req, res) => {
		responseErrorHandler(res, () => {
			const updatedDate = await authorizeRoles(_, ADMIN_ROLES)(req);
			res.send(updatedDate);
		});
	});

	// create delete view
	app.delete('bands/:bandId/tours/:tourId/dates/:dateId', async (req, res) => {
		responseErrorHandler(res, () => {
			const updatedDates = await authorizeRoles(_, ADMIN_ROLES)(req);
			res.send(updatedDates);
		});
	});
};
