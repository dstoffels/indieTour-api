const { firestore } = require('../../firebase.js');
const { USERS } = require('../paths.js');
const { User } = require('./User.js');

exports.createUser = async (request, authUser) => {
	const user = new User(authUser, request.body.hasValidPW);
	user.ref.create(user.data);
	return user.data;
};

exports.getUser = async (request, authUser) => {
	const users = await firestore.collection(USERS).where('email', '==', authUser.email).get();
	return users.docs[0];
};

exports.editUser = async (request, authUser) => {
	const user = await this.getUser(request, authUser);
	await user.ref.update(request.body);
	return user.data();
};
