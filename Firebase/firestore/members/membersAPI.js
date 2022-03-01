const { firestore } = require('../../firebase.js');
const { MEMBER, OWNER, ADMIN } = require('../bands/bandAuth.js');
const { addMemberToBand, addNewOrGetExistingUser } = require('../bands/helpers.js');
const { validateUniqueEmailInCollection, aOrAn } = require('../helpers.js');
const { pathBldr, MEMBERS, BANDS, memberPath, bandPath } = require('../paths.js');
const { Member } = require('./Member.js');

exports.getBandMembers = async (request, authUser) => {
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

exports.addBandMember = async (request, authUser) => {
	const bandId = request.params.bandId;
	const member = request.body;
	const path = pathBldr(BANDS, bandId, MEMBERS);

	return await firestore.runTransaction(async t => {
		const band = await t.get(firestore.doc(bandPath(bandId)));
		const members = await t.get(firestore.collection(path));

		validateUniqueEmailInCollection(members.docs, member.email, MEMBER);

		// create new member
		const user = await addNewOrGetExistingUser(member);
		const newMember = new Member(band.ref, user, member, band.data().name);
		t.set(newMember.ref, newMember.data);

		return newMember;
	});
};

exports.removeBandMember = async (request, authUser) => {
	const { bandId, memberId } = request.params;

	await firestore.runTransaction(async t => {
		const member = await t.get(firestore.doc(memberPath(bandId, memberId)));

		if (!member.exists) throw { code: '/members/does-not-exist' };

		// owner cannot be removed
		if (member.data().role !== OWNER) {
			t.delete(member.ref);
		} else throw { code: 'members/cannot-delete-owner' };
	});
};

exports.changeMemberRole = async (request, authUser) => {
	const { bandId, memberId } = request.params;
	const { role } = request.body;

	return await firestore.runTransaction(async t => {
		const member = await t.get(firestore.doc(memberPath(bandId, memberId)));

		// validate operation
		if (member.data().role === OWNER)
			throw {
				code: 'cannot-change-owner-role',
				message: 'Instead, transfer ownership to another member',
			};

		// switch owners if member is being assigned the owner
		if (role === OWNER) {
			const members = await t.get(firestore.collection(pathBldr(BANDS, bandId, MEMBERS)));
			const owner = members.docs.find(member => member.data().role === OWNER);
			t.update(owner.ref, { role: ADMIN });
		}

		// update member
		t.update(member.ref, { role });
		return { message: `${member.data().email} is now ${aOrAn(role)}` };
	});
};

// exports.editMember = async (request, uid) => {};
