const { firestore, auth } = require('../../firebase.js');
const { BANDS, pathBldr, getPath } = require('../paths.js');

const validateBand

const fetchBand = async bandId => await firestore.doc(pathBldr(BANDS, bandId)).get();
const fetchBands = async () => await firestore.collection(BANDS).get();
