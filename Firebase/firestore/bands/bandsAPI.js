const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { BANDS, MEMBERS, pathBldr, getPath } = require('../paths.js');
const { fetchBand, fetchBands, addMemberToBand } = require('./helpers.js');

exports.createBand = async (request, uid) => {
	const { name, members } = request.body;

	// check for duplicates
	await validateUniqueNameInCollection(BANDS, name, 'band');

	// create new band
	const bandSnap = await firestore
		.collection(BANDS)
		.add({ name })
		.then(doc => doc.get());

	// add band members
	const newMembers = await Promise.all(
		members.map(async member => await addMemberToBand(bandSnap, member)),
	);

	// return new band
	return newMembers.find(member => member.data().uid === uid).data().band;
};

exports.getUserBands = async (request, uid) => {
	const memberQuery = await firestore.collectionGroup(MEMBERS).where('uid', '==', uid).get();
	const userBands = memberQuery.docs.map(doc => {
		return doc.data().band;
	});
	return userBands;
};

exports.editBand = async (request, uid) => {
	const bandDoc = firestore.doc(pathBldr(BANDS, bandId));
	await bandDoc.update(body);
	const bandSnap = await fetchBand(bandId);
	return bandSnap.data();
};

exports.deleteBand = async bandId => {
	// authorize user
	const bandSnap = firestore.doc(pathBldr(BANDS, bandId));
	await bandSnap.delete();
};

exports.removeBandMember = async (bandId, memberId) => {
	const memberSnap = firestore.doc(pathBldr(BANDS, bandId, MEMBERS, memberId));
	memberSnap.delete();
};
