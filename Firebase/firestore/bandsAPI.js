const { firestore } = require('../firebase.js');
const { BANDS, pathBldr, getPath } = require('./paths.js');

const fetchBand = async bandId => await firestore.doc(pathBldr(BANDS, bandId)).get();

exports.createBand = async ({ name, ownerId, admins, members }) => {
	const bands = firestore.collection(BANDS);
	const doc = await bands.add({ name, ownerId, admins, members });
	return getPath(doc);
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
	const bandSnap = firestore.doc(pathBldr(BANDS, bandId));
	await bandSnap.delete();
};
