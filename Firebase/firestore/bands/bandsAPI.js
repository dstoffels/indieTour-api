const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { getMemberQuery } = require('../members/helpers.js');
const { Member } = require('../members/Member.js');
const { BANDS, MEMBERS, pathBldr, bandPath, TOURS } = require('../paths.js');
const { Tour } = require('../tours/Tour.js');
const { OWNER } = require('./bandAuth.js');
const { addNewOrGetExistingUser } = require('./helpers.js');

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
				members.map(async member => await addNewOrGetExistingUser(member)),
			);
			const newMembers = memberUsers.map((user, i) => {
				const member = new Member(newBandRef, user, members[i], name);
				t.set(member.ref, member.data);
				return member;
			});

			// add general tour
			const tour = new Tour(
				newBandRef,
				'General Tour',
				'For rogue tour dates, one-offs or laziness :)',
				true,
			);
			t.set(tour.ref, tour.data);

			return newMembers.find(member => member.data.email === authUser.email).data;
		});
	} catch (error) {}
};

exports.getUserBands = async (request, authUser) => {
	const memberQuery = await getMemberQuery(authUser.email);
	const userBands = memberQuery.docs.map(doc => doc.data());
	return userBands;
};

exports.editBand = async (request, authUser) => {
	const { bandId } = request.params;
	const { name, members } = request.body;

	try {
		return await firestore.runTransaction(async t => {
			const bandRef = firestore.doc(bandPath(bandId));
			const curMemberSnap = await firestore
				.collectionGroup(MEMBERS)
				.where('bandId', '==', bandId)
				.get();

			t.set(bandRef, { name });

			// compare incoming members list, update if current member exists, delete if not
			const curMembers = curMemberSnap.docs.map(doc => {
				const curMember = doc.data();
				curMember.role === OWNER && t.set(doc.ref, { ...curMember, bandName: name });
				const newMember = members.find(mbr => curMember.email === mbr.email);
				Boolean(newMember)
					? t.set(doc.ref, { ...curMember, ...newMember, bandName: name })
					: curMember.role !== OWNER && t.delete(doc.ref);
				return curMember;
			});

			// Add new members, create new user for member if necessary
			// for loop necessary to avoid 'committed writebatch' error from a foreach
			for (let i = 0; i < members.length; i++) {
				const curMember = curMembers.find(curMbr => members[i].email === curMbr.email);
				if (!curMember) {
					const user = await addNewOrGetExistingUser(members[i]);
					const newMember = new Member(bandRef, user, members[i], name);
					t.set(newMember.ref, newMember.data);
				}
			}
		});
	} catch (error) {}
};

exports.deleteBand = async (request, authUser) =>
	await firestore.doc(pathBldr(BANDS, request.params.bandId)).delete();
