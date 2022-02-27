const { createEmailUser } = require('../../auth/authAPI.js');
const { firestore, auth } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { BANDS, MEMBERS, pathBldr, getPath } = require('../paths.js');
const { fetchBandDoc, fetchBandDocs } = require('./helpers.js');

exports.createBand = async (request, uid) => {
	const bandData = request.body;

	// check for duplicates
	await validateUniqueNameInCollection(BANDS, bandData.name, 'band');

	// create new band
	const bandCollection = firestore.collection(BANDS);
	const bandDoc = await bandCollection.add({ name: bandData.name });

	// add band members
	bandData.members.forEach(member => this.addBandMember(bandDoc, member));
	// const members = await Promise.all(bandData.members.map(async member => {}));

	return getPath(bandDoc);
};

exports.getBand = async bandId => {
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

exports.addBandMember = async (bandDoc, member) => {
	// duplicate band data must be stored with each member for
	// collectionGroup queries when fetching bands with which the user is a member
	// TODO: band name must be updated in both band doc and members docs where relevant
	const band = await bandDoc.get();
	const memberBandObj = { id: bandDoc.id, name: band.data().name, memberRole: member.role };

	try {
		const user = await auth.getUserByEmail(member.email);
		await bandDoc
			.collection(MEMBERS)
			.add({ uid: user.uid, email: user.email, band: memberBandObj });
	} catch {
		// TODO: sort out how to handle temporary pw (front end?)
		const user = await createEmailUser({ email: member.email, password: 'password' });
		await bandDoc
			.collection(MEMBERS)
			.add({ uid: user.uid, email: user.email, band: memberBandObj });
	}
};

exports.removeBandMember = async (bandId, memberId) => {
	const memberSnap = firestore.doc(pathBldr(BANDS, bandId, MEMBERS, memberId));
	memberSnap.delete();
};
