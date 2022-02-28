const { createEmailUser } = require('../../auth/authAPI.js');
const { firestore, auth } = require('../../firebase.js');
const { BANDS, pathBldr, getPath, MEMBERS } = require('../paths.js');

// duplicate band data must be stored with each member for
// collectionGroup queries when fetching bands with which the user is a member
// TODO: band name must be updated in both band doc and members docs where relevant
exports.addMemberToBandDoc = async (bandSnap, member) => {
	const memberBandObj = { id: bandSnap.id, name: bandSnap.data().name, memberRole: member.role };

	try {
		const user = await auth.getUserByEmail(member.email);
		await bandSnap.ref
			.collection(MEMBERS)
			.add({ uid: user.uid, email: user.email, band: memberBandObj });
	} catch {
		// TODO: sort out how to handle temporary pw (front end?)
		const user = await createEmailUser({ email: member.email, password: 'password' });
		await bandSnap.ref
			.collection(MEMBERS)
			.add({ uid: user.uid, email: user.email, band: memberBandObj });
	}
};

exports.fetchBandDoc = async bandId => await firestore.doc(pathBldr(BANDS, bandId)).get();
exports.fetchBandDocs = async () => await firestore.collection(BANDS).get();
