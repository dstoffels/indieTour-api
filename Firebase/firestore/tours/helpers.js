const { DATES } = require('../paths.js');

exports.generateTourObj = async tourRef => {
	const tourDates = await tourRef
		.collection(DATES)
		.get()
		.then(snap => snap.docs.map(doc => doc.data()));
	const tour = await tourRef.get().then(doc => doc.data());
	return { ...tour, dates: tourDates };
};
