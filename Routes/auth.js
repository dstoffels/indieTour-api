const auth = require('../Firebase/auth/auth.js');

module.exports = function (app) {
	app.post('/auth/new-user', async (req, res) => {
		try {
			const newUser = await auth.createEmailUser(req.body);
			res.send(newUser);
		} catch (error) {
			error.code === 'auth/email-already-in-use' &&
				res.status(400).json({ message: 'Email already in use.' });
		}
	});

	app.post('/auth/login', async (req, res) => {
		try {
			const user = await auth.emailLogin(req.body);
			res.send(user);
		} catch {
			res.status(400).json({ message: 'Incorrect email/password' });
		}
	});

	app.get('/auth', async (req, res) => {
		try {
			const token = await auth.authorize(req.headers.idtoken);
			res.send(token);
		} catch (error) {
			error.code === 'auth/id-token-expired' &&
				res
					.status(401)
					.json({
						message: 'JWT has expired and must be refreshed or user must be signed in again',
					});
		}
	});
};
