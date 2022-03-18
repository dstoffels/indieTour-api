const {
	authorizeRoles,
	OWNER,
	ADMIN,
	ALL_ROLES,
	ADMIN_ROLES,
} = require('../Firebase/firestore/bands/bandAuth.js');
const {
	getBandMembers,
	addBandMember,
	changeMemberRole,
	removeBandMember,
	updateMember,
} = require('../Firebase/firestore/members/membersAPI.js');

module.exports = function (app) {
	app.get('/bands/:bandId/members', async (req, res) => {
		try {
			const bandMembers = await authorizeRoles(getBandMembers, ALL_ROLES)(req);
			res.send(bandMembers);
		} catch (error) {
			res.status(400).json(error);
			console.log(error);
		}
	});

	app.post('/bands/:bandId/members', async (req, res) => {
		try {
			const newMember = await authorizeRoles(addBandMember, ADMIN_ROLES)(req);
			res.send(newMember);
		} catch (error) {
			res.status(400).json(error);
			console.log(error);
		}
	});

	app.put('/bands/:bandId/members/:memberId', async (req, res) => {
		try {
			const updatedMember = await authorizeRoles(updateMember, ADMIN_ROLES)(req);
			res.send(updatedMember);
		} catch (error) {
			res.send(error);
		}
	});

	app.put('/bands/:bandId/members/:memberId/role', async (req, res) => {
		try {
			const updatedMember = await authorizeRoles(changeMemberRole, ADMIN_ROLES)(req);
			res.send(updatedMember);
		} catch (error) {
			res.status(400).json(error);
		}
	});

	app.delete('/bands/:bandId/members/:memberId', async (req, res) => {
		try {
			await authorizeRoles(removeBandMember, ADMIN_ROLES)(req);
			res.status(204).send();
		} catch (error) {
			res.status(400).json(error);
		}
	});
};
