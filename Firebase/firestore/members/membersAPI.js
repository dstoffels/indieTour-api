const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { pathBldr, MEMBERS, BANDS } = require('../paths.js');

exports.getBandMembers = async (request, uid) =>
	await firestore
		.collection(pathBldr(BANDS, request.params.bandId, MEMBERS))
		.get()
		.then(col =>
			col.docs.map(doc => {
				return { ...doc.data(), id: doc.id };
			}),
		);

// check for duplicate emails
exports.addBandMember = async (request, uid) => {};

exports.changeMemberRole = async (request, uid) => {};
// owner cannot be removed!!

exports.removeBandMember = async (request, uid) => {
	// const memberSnap = firestore.doc(pathBldr(BANDS, bandId, MEMBERS, memberId));
	// memberSnap.delete();
};
