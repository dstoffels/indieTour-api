const { authorize } = require('../Firebase/auth/authAPI.js');
const { getBandMembers } = require('../Firebase/firestore/members/membersAPI.js');

module.exports = function (app) {
	app.get('/bands/:bandId/members', async (req, res) => {
		const bandMembers = await authorize(getBandMembers)(req);
		res.send(bandMembers);
	});

	app.delete('bands/:bandId/members/:memberId');
};
