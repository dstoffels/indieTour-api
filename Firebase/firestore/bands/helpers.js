const { createEmailUser } = require('../../auth/authAPI.js');
const { firestore, auth } = require('../../firebase.js');
const { BANDS, pathBldr, getPath, MEMBERS } = require('../paths.js');
const BandData = require('./BandData.js');

// duplicate band data must be stored with each member for
// collectionGroup queries when fetching bands with which the user is a member
// TODO: band name must be updated in both band doc and members docs where relevant
exports.addMemberToBand = async (bandSnap, member) => {
	const band = new BandData(bandSnap, member);
	console.log(band);

	try {
		const user = await auth.getUserByEmail(member.email);
		const newMember = await bandSnap.ref
			.collection(MEMBERS)
			.add({ uid: user.uid, email: user.email, band: { ...band } })
			.then(doc => doc.get());
		return newMember;
	} catch {
		// TODO: sort out how to handle temporary pw (front end?)
		const user = await createEmailUser({ email: member.email, password: 'password' });
		return await bandSnap.ref
			.collection(MEMBERS)
			.add({ uid: user.uid, email: user.email, band: { ...band } })
			.then(doc => doc.get());
	}
};

exports.fetchBandDoc = async bandId => await firestore.doc(pathBldr(BANDS, bandId)).get();
exports.fetchBandDocs = async () => await firestore.collection(BANDS).get();
