const userAPI = require('../Firebase/auth/auth.js');

module.exports = function (app) {
	app.post('/auth/new-user', async (req, res) => {
		try {
			const newUser = await userAPI.createEmailUser(req.body);
			res.send(newUser);
		} catch (error) {
			error.code === 'auth/email-already-in-use' &&
				res.status(400).json({ message: 'Email already in use.' });
		}
	});

	app.post('/auth/login', async (req, res) => {
		try {
			const user = await userAPI.emailLogin(req.body);
			res.send(user);
		} catch {
			res.status(400).json({ message: 'Incorrect email/password' });
		}
	});
};
