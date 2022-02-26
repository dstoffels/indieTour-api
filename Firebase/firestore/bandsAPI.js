const { firestore } = require('../firebase.js');
const { BANDS, pathBldr, getPath } = require('./paths.js');

exports.createBand = ({ name, ownerId, admins, members }, res) => {
	const bands = firestore.collection(BANDS);
	bands.add({ name, ownerId, admins, members }).then(doc => {
		res.send(getPath(doc));
	});
};

exports.deleteBand = (bandId, res) => {
	const band = firestore.doc(pathBldr(BANDS, bandId));
	band
		.delete()
		.then(time => res.send(time))
		.catch(err => res.send(err));
};
