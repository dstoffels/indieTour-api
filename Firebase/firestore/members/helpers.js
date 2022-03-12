const { firestore } = require('../../firebase.js');
const { MEMBERS } = require('../paths.js');

exports.getMemberQuery = async email =>
	await firestore.collectionGroup(MEMBERS).where('email', '==', email).get();
