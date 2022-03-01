const { getAuthorizedUser: decodeToken } = require('../../auth/authAPI.js');
const { getMemberQuery } = require('../members/helpers.js');

const OWNER = 'owner';
const ADMIN = 'admin';
const MEMBER = 'member';
const ALL_ROLES = [OWNER, ADMIN, MEMBER];

const validateMember = async (authUser, roles, bandId) => {
	const memberQuery = await getMemberQuery(authUser.uid);

	const validMember = memberQuery.docs.find(
		member => roles.includes(member.data().role) && member.data().bandId === bandId,
	);

	if (!validMember) throw { code: 'unauthorized' };
};

const authorizeRoles = (APIfn, roles) => async request => {
	const authUser = await decodeToken(request.headers.auth);
	await validateMember(authUser, roles, request.params.bandId);
	return await APIfn(request, authUser);
};

module.exports = { OWNER, ADMIN, MEMBER, ALL_ROLES, authorizeRoles };
