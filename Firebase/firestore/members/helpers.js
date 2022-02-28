const { firestore } = require('../../firebase.js');
const { MEMBERS } = require('../paths.js');

exports.getMemberQuery = async uid =>
	await firestore.collectionGroup(MEMBERS).where('uid', '==', uid).get();
