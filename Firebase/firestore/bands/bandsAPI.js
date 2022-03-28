const { AuthUser } = require('../../auth/authAPI.js');
const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { getMemberQuery } = require('../members/helpers.js');
const { Member } = require('../members/Member.js');
const {
	BANDS,
	MEMBERS,
	bandPath,
	bandMembersPath,
	bandToursPath,
	USERS,
	DATES,
} = require('../paths.js');
const { generateTourObj } = require('../tours/helpers.js');
const { Tour } = require('../tours/Tour.js');
const { OWNER } = require('./bandAuth.js');
const { addNewOrGetExistingUser } = require('./helpers.js');

exports.createBand = async (request, authUser) => {
	const { name, members } = request.body;

	// add creator as band owner
	members.push({ ...authUser, role: OWNER });

	try {
		return await firestore.runTransaction(async t => {
			const bands = await t.get(firestore.collection(BANDS));
			const user = t.get(firestore.doc(`${USERS}/${authUser.uid}`));

			// check for duplicates
			validateUniqueNameInCollection(bands.docs, name, 'band');

			// create new band
			const newBandRef = firestore.collection(BANDS).doc();
			t.set(newBandRef, { name });

			// add general tour
			const tour = new Tour(newBandRef);
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

			const userMember = newMembers.find(member => member.data.email === authUser.email).data;

			// return new memberBand w active tour and dates
			return { ...userMember, activeTour: { ...userMember.activeTour, dates: [] } };
		});
	} catch (error) {}
};

exports.getUserBands = async (request, authUser) => {
	const memberQuery = await getMemberQuery(authUser.email);
	const userBands = memberQuery.docs.map(doc => doc.data());
	const userBandsWithDates = Promise.all(
		userBands.map(async band => {
			// skip if user has no active tour
			if (band.activeTour) {
				const tourPath = band.activeTour.path;
				const tourRef = firestore.doc(tourPath);
				const tourWithDates = await generateTourObj(tourRef);
				band.activeTour = tourWithDates;
			}
			return band;
		}),
	);
	return userBandsWithDates;
};

/** EDIT BAND **
 *
 * @param {import('express').Request} request
 * @param {AuthorizedUser} authUser
 * @returns
 */
exports.editBand = async (request, authUser) => {
	const { bandId } = request.params;
	const { name, members } = request.body;

	let activeMember;
	const bandRef = firestore.doc(bandPath(bandId));
	const membersQuery = firestore.collectionGroup(MEMBERS).where('bandId', '==', bandId);

	try {
		await firestore.runTransaction(async t => {
			const membersSnap = await t.get(membersQuery);

			t.set(bandRef, { name });

			// compare incoming members list, update if current member exists, delete if not
			const curMembers = membersSnap.docs.map(doc => {
				const curMember = doc.data();
				// get user's activeMember
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
			// for loop necessary to avoid firebase 'committed writebatch' error from a foreach
			for (let i = 0; i < members.length; i++) {
				const curMember = curMembers.find(curMbr => members[i].email === curMbr.email);
				if (!curMember) {
					const user = await addNewOrGetExistingUser(members[i]);
					const newMember = new Member(bandRef, user, members[i], name);
					t.set(newMember.ref, newMember.data);
				}
			}
		});

		// get activeMember data
		activeMember = await activeMember.get().then(doc => doc.data());

		// generate active tour data with dates[]
		const activeTourRef = firestore.doc(activeMember.activeTour.path);
		const activeTour = await generateTourObj(activeTourRef);

		// bundle member for frontend
		return { ...activeMember, activeTour };
	} catch (error) {
		console.log(error);
	}
};

/**
 * Removes a band and its subcollective tours and members in the firstore db
 * @param {import('express').Request} request
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

		// delete all tours an tourDates
		for (let i = 0; i < tours.docs.length; i++) {
			const tour = tours.docs[i].ref;

			// delete dates first
			const dates = await tour
				.collection(DATES)
				.listDocuments()
				.then(docs => docs.map(doc => doc));

			dates.forEach(date => t.delete(date));

			// delete tour
			t.delete(tour);
		}

		// delete all members
		members.docs.forEach(doc => t.delete(doc.ref));

		// delete band
		t.delete(bandRef);
	});
	return await this.getUserBands(request, authUser);
};
