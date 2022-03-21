const { AuthUser } = require('../../auth/authAPI.js');
const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { getMemberQuery } = require('../members/helpers.js');
const { Member } = require('../members/Member.js');
const { BANDS, MEMBERS, bandPath, bandMembersPath, bandToursPath, USERS } = require('../paths.js');
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
			const user = t.get(firestore.doc(`${USERS}/${authUser.uid}`));

			// check for duplicates
			validateUniqueNameInCollection(bands.docs, name, 'band');

			// create new band
			const newBandRef = firestore.collection(BANDS).doc();
			t.set(newBandRef, { name });

			// add general tour
			const tour = new Tour(
				newBandRef,
				'General Tour',
				'For rogue tour dates, one-offs or laziness :)',
				true,
			);
			t.set(tour.ref, tour.data);

			// add members
			const memberUsers = await Promise.all(
				members.map(async member => await addNewOrGetExistingUser(member)),
			);
			const newMembers = memberUsers.map((user, i) => {
				const member = new Member(newBandRef, user, members[i], name, tour);
				t.set(member.ref, member.data);
				return member;
			});

			// await editUser({ body: { activeTour: tour.data } }, authUser);

			return newMembers.find(member => member.data.email === authUser.email).data;
		});
	} catch (error) {}
};

exports.getUserBands = async (request, authUser) => {
	const memberQuery = await getMemberQuery(authUser.email);
	const userBands = memberQuery.docs.map(doc => doc.data());
	return userBands.sort((a, b) => {
		if (a.bandName < b.bandName) return -1;
		if (a.bandName > b.bandName) return 1;
		return 0;
	});
};

/**
 *
 * @param {*} request
 * @param {*} authUser
 * @returns
 */
exports.editBand = async (request, authUser) => {
	const { bandId } = request.params;
	const { name, members } = request.body;

	let activeMember;
	const bandRef = firestore.doc(bandPath(bandId));
	const membersQuery = await firestore.collectionGroup(MEMBERS).where('bandId', '==', bandId);

	try {
		await firestore.runTransaction(async t => {
			const membersSnap = await t.get(membersQuery);

			t.set(bandRef, { name });

			// compare incoming members list, update if current member exists, delete if not
			const curMembers = membersSnap.docs.map(doc => {
				const curMember = doc.data();
				if (curMember.email === authUser.email) activeMember = doc.ref;
				// update owner member
				curMember.role === OWNER && t.update(doc.ref, { bandName: name });

				const newMember = members.find(mbr => curMember.email === mbr.email);
				Boolean(newMember)
					? t.update(doc.ref, { ...newMember, bandName: name })
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
		return await activeMember.get().then(doc => doc.data());
	} catch (error) {
		console.log(error);
	}
};

/**
 * Removes a band and its subcollective tours and members in the firstore db
 * @param {Request} request
 * @param {AuthUser} authUser
 * @returns the updated bands list for the authorized user
 */
exports.deleteBand = async (request, authUser) => {
	const { bandId } = request.params;

	const bandRef = firestore.doc(bandPath(bandId));
	const membersRefs = firestore.collection(bandMembersPath(bandId));
	const toursRefs = firestore.collection(bandToursPath(bandId));

	await firestore.runTransaction(async t => {
		const members = await t.get(membersRefs);
		const tours = await t.get(toursRefs);

		// delete all members
		members.docs.forEach(doc => t.delete(doc.ref));

		// delete all tours
		tours.docs.forEach(doc => t.delete(doc.ref));

		// delete band
		t.delete(bandRef);
	});
	return await this.getUserBands(request, authUser);
};
