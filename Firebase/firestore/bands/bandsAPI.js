const { firestore } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { getMemberQuery } = require('../members/helpers.js');
const { BANDS, MEMBERS, pathBldr } = require('../paths.js');
const { fetchBand, addMemberToBand } = require('./helpers.js');

exports.createBand = async (request, uid) => {
	const { name, members } = request.body;

	// check for duplicates
	await validateUniqueNameInCollection(BANDS, name, 'band');

	// create new band
	const band = await firestore
		.collection(BANDS)
		.add({ name })
		.then(doc => doc.get());

	// add band members
	const newMembers = await Promise.all(
		members.map(async member => await addMemberToBand(band, member)),
	);

	// return new band
	return newMembers.find(member => member.data().uid === uid).data().band;
};

exports.getUserBands = async (request, uid) => {
	const memberQuery = await getMemberQuery(uid);
	const userBands = memberQuery.docs.map(doc => doc.data().band);
	return userBands;
};

exports.editBand = async (request, uid) => {
	const bandId = request.params.bandId;
	const newName = request.body.name;

	//
	return await firestore.runTransaction(async t => {
		const band = await fetchBand(bandId);
		const members = await band.ref.collection(MEMBERS).get();

		t.update(band.ref, { name: newName });
		members.docs.forEach(member =>
			t.update(member.ref, { band: { ...member.data().band, name: newName } }),
		);

		return await getMemberQuery(uid).then(query =>
			query.docs.find(member => member.data().band.id === bandId).data(),
		);
	});
};

exports.deleteBand = async (request, uid) =>
	await firestore.doc(pathBldr(BANDS, request.params.bandId)).delete();
