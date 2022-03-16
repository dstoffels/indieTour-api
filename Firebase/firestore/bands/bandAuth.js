const { getAuthorizedUser: decodeToken, getAuthorizedUser } = require('../../auth/authAPI.js');
const { getMemberQuery } = require('../members/helpers.js');

const OWNER = 'owner';
const ADMIN = 'admin';
const MEMBER = 'member';
const ADMIN_ROLES = [OWNER, ADMIN];
const ALL_ROLES = [OWNER, ADMIN, MEMBER];

const validateMember = async (authUser, roles, bandId) => {
	const memberQuery = await getMemberQuery(authUser.email);
	// console.log(memberQuery.docs);

	const validMember = memberQuery.docs.find(
		member => roles.includes(member.data().role) && member.data().bandId === bandId,
	);

	if (!validMember) throw { code: `${authUser.email} is not authorized` };
};

const authorizeRoles = (APIfn, roles) => async request => {
	const authUser = await getAuthorizedUser(request.headers.auth);
	await validateMember(authUser, roles, request.params.bandId);
	return await APIfn(request, authUser);
};

module.exports = { OWNER, ADMIN, MEMBER, ADMIN_ROLES, ALL_ROLES, authorizeRoles };
