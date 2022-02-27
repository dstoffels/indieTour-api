const { firestore } = require('../../firebase.js');
const { BANDS, pathBldr, getPath } = require('../paths.js');

// const validateBand???

exports.fetchBandDoc = async bandId => await firestore.doc(pathBldr(BANDS, bandId)).get();
exports.fetchBandDocs = async () => await firestore.collection(BANDS).get();
