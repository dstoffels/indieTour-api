const { authorize, createEmailUser } = require('../../auth/authAPI.js');
const { firestore, auth } = require('../../firebase.js');
const { validateUniqueNameInCollection } = require('../helpers.js');
const { BANDS, pathBldr, getPath } = require('../paths.js');

exports.createBand = async (request, uid) => {
	const bandData = request.body;

	// check for duplicates
	await validateUniqueNameInCollection(BANDS, bandData.name, 'band');

	// check members list & create new users if they do not exist
	const members = await Promise.all(
		bandData.members.map(async member => {
			try {
				const user = await auth.getUserByEmail(member.email);
				console.log(user);
				return { uid: user.uid, email: user.email, role: member.role };
			} catch {
				const user = await createEmailUser({ email: member.email, password: 'password' });
				return { uid: user.uid, email: user.email, role: member.role };
			}
		}),
	);

	// add new band
	const bandCollection = firestore.collection(BANDS);
	const doc = await bandCollection.add({ name: bandData.name, members });
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
	// authorize user
	const bandSnap = firestore.doc(pathBldr(BANDS, bandId));
	await bandSnap.delete();
};

exports.getUserBands = idToken => {
	const uid = authorize(idToken);
};
