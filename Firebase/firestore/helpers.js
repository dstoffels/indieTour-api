const { firestore, auth } = require('../firebase.js');

const validateUniqueNameInCollection = async (path, name, type = 'item') => {
	const snapshot = await firestore.collection(path).get();
	const docs = snapshot.docs.map(doc => doc.data());
	if (docs.find(item => item.name === name)) {
		throw {
			code: `${type}/duplicate`,
			message: capitalize(`${aOrAn(type)} of that name already exists.`),
		};
	}
};

function aOrAn(word) {
	const vowels = ['a', 'e', 'i', 'o', 'u'];
	return vowels.includes(word.charAt(0)) ? `an ${word}` : `a ${word}`;
}

function capitalize(str) {
	const first = str.charAt(0).toUpperCase();
	return first + str.slice(1);
}

module.exports = { validateUniqueNameInCollection, aOrAn, capitalize };
