const { decodeToken } = require('../../auth/authAPI.js');
const { getMemberQuery } = require('../members/helpers.js');

const OWNER = 'owner';
const ADMIN = 'admin';
const MEMBER = 'member';

const validateMember = async (uid, roles, bandId) => {
	const memberQuery = await getMemberQuery(uid);
	return memberQuery.docs.find(doc => {
		const member = doc.data();
		return roles.includes(member.band.memberRole) && member.band.id === bandId;
	});
};

const authorizeOwner = APIfn => async request => {
	const uid = await decodeToken(request.headers.auth);

	if (await validateMember(uid, [OWNER], request.params.bandId)) {
		return await APIfn(request, uid);
	}

	throw {
		code: 'bands/unauthorized',
		message: 'Only the owner of this band is authorized to do this.',
	};
};

const authorizeAdmin = APIfn => async request => {
	const uid = await decodeToken(request.headers.auth);

	if (await validateMember(uid, [ADMIN, OWNER], request.params.bandId)) {
		return await APIfn(request, uid);
	}

	throw {
		code: 'bands/unauthorized',
		message: 'Only an admin of this band is authorized to do this.',
	};
};

const authorizeMember = APIfn => async request => {
	const uid = await decodeToken(request.headers.auth);

	if (await validateMember(uid, [MEMBER, ADMIN, OWNER], request.params.bandId)) {
		return await APIfn(request, uid);
	}

	throw {
		code: 'bands/unauthorized',
		message: 'Only an members of this band is authorized to do this.',
	};
};

module.exports = { OWNER, ADMIN, MEMBER, authorizeOwner, authorizeAdmin, authorizeMember };
