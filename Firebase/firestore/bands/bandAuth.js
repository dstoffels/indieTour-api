const { decodeToken } = require('../../auth/authAPI.js');
const { firestore } = require('../../firebase.js');
const { MEMBERS } = require('../paths.js');

const OWNER = 'owner';
const ADMIN = 'admin';
const MEMBER = 'member';

const authorizeOwner = APIfn => async request => {
	const uid = await decodeToken(request.headers.auth);
	const memberQuery = await firestore.collectionGroup(MEMBERS).where('uid', '==', uid).get();
	console.log(memberQuery.docs);
	if (
		!memberQuery.docs.find(doc => {
			const member = doc.data();
			return member.band.memberRole === OWNER && member.band.id === request.params.bandId;
		})
	) {
		throw {
			code: 'bands/unauthorized',
			message: 'Only the owner of this band is authorized to do this.',
		};
	}
	return await APIfn(request, uid);
};

module.exports = { OWNER, ADMIN, MEMBER, authorizeOwner };
