const { decodeToken } = require('../../auth/authAPI.js');
const { firestore } = require('../../firebase.js');
const { MEMBERS } = require('../paths.js');

const OWNER = 'owner';
const ADMIN = 'admin';
const MEMBER = 'member';

exports.authorizeOwner = APIfn => async request => {
	const uid = await decodeToken(request.headers.auth);
	const memberQuery = await firestore.collectionGroup(MEMBERS).where('uid', '==', uid).get();
	if (
		!memberQuery.docs.find(
			member => member.band.role === OWNER && member.band.id === request.params.bandId,
		)
	)
		return await APIfn(request, uid);
};

module.exports = { OWNER, ADMIN, MEMBER };
