const { authorize } = require('../Firebase/auth/authAPI.js');
const usersAPI = require('../Firebase/firestore/users/usersAPI.js');

module.exports = function (app) {
	app.post('/user', async (req, res) => {
		try {
			const user = await authorize(usersAPI.createUser)(req);
			res.send(user);
		} catch (error) {
			res.send(error);
		}
	});

	app.get('/user', async (req, res) => {
		try {
			const user = await authorize(usersAPI.getUser)(req);
			console.log(user);
			res.send(user.data());
		} catch (error) {
			console.log(error);
			switch (error.code) {
				case 'auth/id-token-expired':
					res.status(401).send(error.code);
					break;
				default:
					res.status(400).send(error);
					break;
			}
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
