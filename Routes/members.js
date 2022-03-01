const { authorize } = require('../Firebase/auth/authAPI.js');
const { authorizeAdmin, authorizeOwner } = require('../Firebase/firestore/bands/bandAuth.js');
const {
	getBandMembers,
	addBandMember,
	changeMemberRole,
	removeBandMember,
} = require('../Firebase/firestore/members/membersAPI.js');

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
			res.status(400).json(error);
		}
	});

	app.put('/bands/:bandId/members/:memberId/role', async (req, res) => {
		try {
			const updatedMember = await authorizeOwner(changeMemberRole)(req);
			res.send(updatedMember);
		} catch (error) {
			res.status(400).json(error);
		}
	});

	app.delete('/bands/:bandId/members/:memberId', async (req, res) => {
		try {
			await authorizeOwner(removeBandMember)(req);
			res.status(204);
		} catch (error) {
			res.status(400).json(error);
		}
	});
};
