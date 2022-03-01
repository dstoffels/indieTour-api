const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { getMemberQuery } = require('../members/helpers.js');
const MemberData = require('../members/MemberData.js');
const { BANDS, MEMBERS, pathBldr, bandPath } = require('../paths.js');
const { OWNER } = require('./bandAuth.js');
const { addNewOrGetExistingUsers } = require('./helpers.js');

exports.createBand = async (request, authUser) => {
	const { name, members } = request.body;

	// add creator as band owner
	members.push({ ...authUser, role: OWNER });

	try {
		return firestore.runTransaction(async t => {
			const bands = await t.get(firestore.collection(BANDS));

			// check for duplicates
			validateUniqueNameInCollection(bands.docs, name, 'band');

			// create new band
			const newBandRef = firestore.collection(BANDS).doc();
			t.set(newBandRef, { name });

			// add members
			const memberUsers = await Promise.all(
				members.map(async member => await addNewOrGetExistingUsers(member)),
			);

			const newMembers = memberUsers.map((user, i) => {
				const newMemberRef = newBandRef.collection(MEMBERS).doc();
				const member = new MemberData(newMemberRef.id, user, members[i], newBandRef, name);
				t.set(newMemberRef, { ...member });
				return member;
			});

			return newMembers.find(member => member.uid === authUser.uid);
		});
	} catch (error) {}
};

exports.getUserBands = async (request, authUser) => {
	const memberQuery = await getMemberQuery(authUser.uid);
	const userBands = memberQuery.docs.map(doc => doc.data());
	return userBands;
};

exports.editBand = async (request, authUser) => {
	const bandId = request.params.bandId;
	const newName = request.body.name;

	return await firestore.runTransaction(async t => {
		const bandRef = firestore.doc(bandPath(bandId));
		const members = await t.get(bandRef.collection(MEMBERS));

		// update band & member data, (will we need to do this for tours, dates etc?)
		t.update(bandRef, { name: newName });
		members.docs.forEach(member => t.update(member.ref, { ...member.data(), bandName: newName }));

		return members.docs.find(member => member.data().bandId === bandId).data();
	});
};

exports.deleteBand = async (request, authUser) =>
	await firestore.doc(pathBldr(BANDS, request.params.bandId)).delete();
