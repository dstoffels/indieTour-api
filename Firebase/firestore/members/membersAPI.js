const { firestore } = require('../../firebase.js');
const { MEMBER, OWNER, ADMIN } = require('../bands/bandAuth.js');
const { addMemberToBand } = require('../bands/helpers.js');
const { validateUniqueEmailInCollection } = require('../helpers.js');
const { pathBldr, MEMBERS, BANDS, memberPath, bandPath } = require('../paths.js');

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

exports.removeBandMember = async (request, uid) => {
	const { bandId, memberId } = request.params;

	return await firestore.runTransaction(async t => {
		const member = await t.get(firestore.doc(memberPath(bandId, memberId)));

		if (!member.exists) throw { code: '/members/does-not-exist' };

		// owner cannot be removed
		if (member.data().band.memberRole !== OWNER) {
			t.delete(member.ref);
			return { message: 'success' };
		} else throw { code: 'members/cannot-delete-owner' };
	});
};

exports.changeMemberRole = async (request, uid) => {
	const { bandId, memberId } = request.params;
	const { role } = request.body;

	return await firestore.runTransaction(async t => {
		const member = await t.get(firestore.doc(memberPath(bandId, memberId)));

		if (member.data().band.memberRole === OWNER) throw { code: 'cannot-change-owner-role' };

		// switch owners
		if (role === OWNER) {
			const members = await t.get(firestore.collection(bandPath(bandId) + MEMBERS));
			const owner = members.docs.find(member => member.data().band.role === OWNER);
			t.update(owner.ref, { band: { memberRole: ADMIN } });
		}

		// update member
		t.update(member.ref, { band: { memberRole: role } });
	});
};

// exports.editMember = async (request, uid) => {};
