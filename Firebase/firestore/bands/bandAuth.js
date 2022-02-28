const { decodeToken } = require('../../auth/authAPI.js');
const { getMemberQuery } = require('./helpers.js');

const OWNER = 'owner';
const ADMIN = 'admin';
const MEMBER = 'member';

const validateMember = async (role, bandId) => {
	const memberQuery = await getMemberQuery(uid);
	return memberQuery.docs.find(doc => {
		const member = doc.data();
		return member.band.memberRole === role && member.band.id === bandId;
	});
};

const authorizeOwner = APIfn => async request => {
	const uid = await decodeToken(request.headers.auth);

	if (await validateMember(OWNER, request.params.bandId)) {
		return await APIfn(request, uid);
	}

	throw {
		code: 'bands/unauthorized',
		message: 'Only the owner of this band is authorized to do this.',
	};
};

const authorizeAdmin = APIfn => async request => {
	const uid = await decodeToken(request.headers.auth);

	if (await validateMember(ADMIN, request.params.bandId)) {
		return await APIfn(request, uid);
	}

	throw {
		code: 'bands/unauthorized',
		message: 'Only an admin of this band is authorized to do this.',
	};
};

const authorizeMember = APIfn => async request => {
	const uid = await decodeToken(request.headers.auth);

	if (await validateMember(MEMBER, request.params.bandId)) {
		return await APIfn(request, uid);
	}

	throw {
		code: 'bands/unauthorized',
		message: 'Only an members of this band is authorized to do this.',
	};
};

module.exports = { OWNER, ADMIN, MEMBER, authorizeOwner, authorizeAdmin, authorizeMember };
