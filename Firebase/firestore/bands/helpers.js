const { createEmailUser } = require('../../auth/authAPI.js');
const { firestore, auth } = require('../../firebase.js');
const { BANDS, MEMBERS, pathBldr } = require('../paths.js');
const MemberData = require('../members/MemberData.js');

// duplicate band data must be stored with each member for
// collectionGroup queries when fetching bands with which the user is a member
exports.addMemberToBand = async (band, member) => {
	try {
		const { uid, email, displayName } = await auth.getUserByEmail(member.email);
		console.log(uid, email, displayName);
		const newMember = await band.ref
			.collection(MEMBERS)
			.add(...new MemberData(uid, email, displayName, member, band))
			.then(doc => doc.get());
		return newMember;
	} catch {
		// TODO: sort out how to handle temporary pw (front end?)
		const { uid, email, displayName } = await createEmailUser({
			email: member.email,
			password: 'password',
			name: member.name,
		});
		return await band.ref
			.collection(MEMBERS)
			.add(...new MemberData(uid, email, displayName, member, band))
			.then(doc => doc.get());
	}
};

exports.addNewOrGetExistingUsers = async member => {
	try {
		return await auth.getUserByEmail(member.email);
	} catch {
		return await createEmailUser({
			email: member.email,
			password: 'password',
			displayName: member.name,
		});
	}
};

exports.fetchBand = async bandId => await firestore.doc(pathBldr(BANDS, bandId)).get();
