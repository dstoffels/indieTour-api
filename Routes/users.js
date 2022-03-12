const { authorize } = require('../Firebase/auth/authAPI.js');
const usersAPI = require('../Firebase/firestore/users/usersAPI.js');

module.exports = function (app) {
	app.post('/users/new', async (req, res) => {
		try {
			const user = await authorize(usersAPI.createUser)(req);
			res.send(user);
		} catch (error) {
			res.send(error);
			console.log(error);
		}
	});

	app.get('/user', async (req, res) => {
		try {
			const user = await authorize(usersAPI.getUser)(req);
			res.send(user.data());
		} catch (error) {
			res.send(error);
		}
	});

	app.put('/user', async (req, res) => {
		try {
			const user = await authorize(usersAPI.editUser)(req);
			res.send(user);
		} catch (error) {
			res.send(error);
		}
	});
};
