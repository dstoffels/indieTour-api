const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { BANDS, MEMBERS, pathBldr, getPath } = require('../paths.js');
const { fetchBandDoc, fetchBandDocs, addMemberToBandDoc } = require('./helpers.js');

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
	members.forEach(member => addMemberToBandDoc(bandSnap, member));

	return getPath(bandDoc);
};

exports.selectBand = async bandId => {
	const bandSnap = await fetchBand(bandId);
	return bandSnap.data();
};

exports.editBand = async (bandId, body) => {
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

exports.getUserBands = async (request, uid) => {
	const memberQuery = await firestore.collectionGroup(MEMBERS).where('uid', '==', uid).get();
	const userBands = memberQuery.docs.map(doc => {
		return doc.data().band;
	});
	return userBands;
};

exports.removeBandMember = async (bandId, memberId) => {
	const memberSnap = firestore.doc(pathBldr(BANDS, bandId, MEMBERS, memberId));
	memberSnap.delete();
};
