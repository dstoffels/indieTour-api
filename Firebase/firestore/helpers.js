const { firestore, auth } = require('../firebase.js');

const validateUniqueNameInCollection = (array, name, type = 'item') => {
	if (array.find(item => item.data().name === name)) {
		throw {
			code: `${type}/duplicate`,
			message: capitalize(`${aOrAn(type)} of that name already exists.`),
		};
	}
};

// TODO: combine into once validateUniqueItem function with item['key'] === ...
const validateUniqueEmailInCollection = (array, email, type = 'item') => {
	if (array.find(item => item.data().email === email)) {
		throw {
			code: `${type}/duplicate`,
			message: capitalize(`${aOrAn(type)} with that email already exists.`),
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

module.exports = {
	validateUniqueNameInCollection,
	validateUniqueEmailInCollection,
	aOrAn,
	capitalize,
};
