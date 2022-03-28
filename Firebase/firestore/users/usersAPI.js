const { firestore } = require('../../firebase.js');
const { USERS, TOURS } = require('../paths.js');
const { generateTourObj } = require('../tours/helpers.js');
const { User } = require('./User.js');

/**
 *
 * @param {import('express').Request} request
 * @param {} authUser
 * @returns
 */
exports.createUser = async request => {
	const user = new User(request.body);
	await user.ref.create(user.data);
	return user.data;
};

/**
 *
 * @param {import('express').Request} request
 * @param {} authUser
 * @returns
 */
exports.getUser = async (request, authUser) => {
	const usersSnap = firestore.collection(USERS).where('email', '==', authUser.email);
	return await firestore.runTransaction(async t => {
		const users = await t.get(usersSnap);
		const user = users.docs[0].data();

		// must bundle tourDates
		if (user.activeMember) {
			const tour = firestore.doc(user.activeMember.activeTour.path);
			const activeTourWithDates = await generateTourObj(tour);
			user.activeMember.activeTour = activeTourWithDates;
			return user;
		}
		return user;
	});
};

/**
 *
 * @param {import('express').Request} request
 * @param {} authUser
 * @returns
 */
exports.editUser = async (request, authUser) => {
	const usersSnap = firestore.collection(USERS).where('email', '==', authUser.email);
	const users = await usersSnap.get();
	const user = users.docs[0];

	// remove dates[] to prevent dates being added to user doc
	const data = request.body;
	Boolean(data.activeMember?.activeTour) && delete data.activeMember.activeTour.dates;

	await user.ref.update(data);
	return user.data();
};
