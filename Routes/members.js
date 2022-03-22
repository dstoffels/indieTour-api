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
const responseErrorHandler = require('../utils/responseErrorHandler.js');

module.exports = function (app) {
	app.get('/bands/:bandId/members', async (req, res) => {
		responseErrorHandler(res, async () => {
			const bandMembers = await authorizeRoles(getBandMembers, ALL_ROLES)(req);
			res.send(bandMembers);
		});
	});

	app.post('/bands/:bandId/members', async (req, res) => {
		responseErrorHandler(res, async () => {
			const newMember = await authorizeRoles(addBandMember, ADMIN_ROLES)(req);
			res.send(newMember);
		});
	});

	app.put('/bands/:bandId/members/:memberId', async (req, res) => {
		responseErrorHandler(res, async () => {
			const updatedMember = await authorizeRoles(updateMember, ADMIN_ROLES)(req);
			res.send(updatedMember);
		});
	});

	app.put('/bands/:bandId/members/:memberId/role', async (req, res) => {
		responseErrorHandler(res, async () => {
			const updatedMember = await authorizeRoles(changeMemberRole, ADMIN_ROLES)(req);
			res.send(updatedMember);
		});
	});

	app.delete('/bands/:bandId/members/:memberId', async (req, res) => {
		responseErrorHandler(res, async () => {
			await authorizeRoles(removeBandMember, ADMIN_ROLES)(req);
			res.status(204).send();
		});
	});
};
