const { authorize } = require('../Firebase/auth/authAPI.js');
const usersAPI = require('../Firebase/firestore/users/usersAPI.js');
const responseErrorHandler = require('../utils/responseErrorHandler.js');

module.exports = function (app) {
	app.post('/user', async (req, res) => {
		await responseErrorHandler(res, async () => {
			const user = await usersAPI.createUser(req);
			res.send(user);
		});
	});

	app.get('/user', async (req, res) => {
		await responseErrorHandler(res, async () => {
			const user = await authorize(usersAPI.getUser)(req);
			res.send(user);
		});
	});

	app.put('/user', async (req, res) => {
		await responseErrorHandler(res, async () => {
			const user = await authorize(usersAPI.editUser)(req);
			res.send(user);
		});
	});
};
