const { authorize } = require('../Firebase/auth/authAPI.js');
const { authorizeAdmin } = require('../Firebase/firestore/bands/bandAuth.js');
const { getBandMembers, addBandMember } = require('../Firebase/firestore/members/membersAPI.js');

module.exports = function (app) {
	app.get('/bands/:bandId/members', async (req, res) => {
		const bandMembers = await authorize(getBandMembers)(req);
		res.send(bandMembers);
	});

	app.post('/bands/:bandId/members', async (req, res) => {
		try {
			const newMember = await authorizeAdmin(addBandMember)(req);
			res.send(newMember);
		} catch (error) {
			console.log(error);
			res.status(400).json(error);
		}
	});

	app.delete('bands/:bandId/members/:memberId');
};
