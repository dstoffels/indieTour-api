const { firestore } = require('../../firebase.js');
const { MEMBER } = require('../bands/bandAuth.js');
const { addMemberToBand } = require('../bands/helpers.js');
const { validateUniqueEmailInCollection } = require('../helpers.js');
const { pathBldr, MEMBERS, BANDS } = require('../paths.js');

exports.getBandMembers = async (request, uid) => {
	const bandId = request.params.bandId;
	const path = pathBldr(BANDS, bandId, MEMBERS);
	return await firestore
		.collection(path)
		.get()
		.then(collection =>
			collection.docs.map(doc => {
				return { ...doc.data(), id: doc.id };
			}),
		);
};

exports.addBandMember = async (request, uid) => {
	const bandId = request.params.bandId;
	const member = request.body;
	const path = pathBldr(BANDS, bandId, MEMBERS);

	await validateUniqueEmailInCollection(path, member.email, MEMBER);

	const band = await firestore.doc(pathBldr(BANDS, bandId)).get();

	await addMemberToBand(band, member);
};

exports.changeMemberRole = async (request, uid) => {};

exports.editMember = async (request, uid) => {};

// owner cannot be removed!!
exports.removeBandMember = async (request, uid) => {
	// const memberSnap = firestore.doc(pathBldr(BANDS, bandId, MEMBERS, memberId));
	// memberSnap.delete();
};
