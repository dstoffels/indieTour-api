const { async } = require('@firebase/util');
const { createEmailUser } = require('../../auth/authAPI.js');
const { firestore, auth } = require('../../firebase.js');
const { BANDS, pathBldr, getPath, MEMBERS } = require('../paths.js');
const BandData = require('./BandData.js');

// duplicate band data must be stored with each member for
// collectionGroup queries when fetching bands with which the user is a member
// TODO: band name must be updated in both band doc and members docs where relevant
exports.addMemberToBand = async (band, member) => {
	const bandData = new BandData(band, member);

	try {
		const user = await auth.getUserByEmail(member.email);
		const newMember = await band.ref
			.collection(MEMBERS)
			.add({ uid: user.uid, email: user.email, band: { ...bandData } })
			.then(doc => doc.get());
		return newMember;
	} catch {
		// TODO: sort out how to handle temporary pw (front end?)
		const user = await createEmailUser({ email: member.email, password: 'password' });
		return await band.ref
			.collection(MEMBERS)
			.add({ uid: user.uid, email: user.email, band: { ...bandData } })
			.then(doc => doc.get());
	}
};

exports.getMemberQuery = async uid =>
	await firestore.collectionGroup(MEMBERS).where('uid', '==', uid).get();
exports.fetchBand = async bandId => await firestore.doc(pathBldr(BANDS, bandId)).get();
exports.fetchBands = async () => await firestore.collection(BANDS).get();
