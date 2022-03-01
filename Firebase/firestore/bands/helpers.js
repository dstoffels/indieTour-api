const { createEmailUser } = require('../../auth/authAPI.js');
const { firestore, auth } = require('../../firebase.js');
const { BANDS, MEMBERS, pathBldr } = require('../paths.js');
const MemberData = require('../members/Member.js');

exports.addNewOrGetExistingUser = async ({ email, password = 'password', displayName }) => {
	try {
		return await auth.getUserByEmail(email);
	} catch {
		return await createEmailUser({ email, password, displayName });
	}
};

exports.fetchBand = async bandId => await firestore.doc(pathBldr(BANDS, bandId)).get();
