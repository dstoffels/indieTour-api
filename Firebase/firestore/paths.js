// ROOT PATHS
const VENUES = '/venues';
const BANDS = '/bands';
const USERS = '/users';

// SUB PATHS
const MEMBERS = 'members';
const TOURS = 'tours';
const DATES = 'dates';
const SCHEDULE = 'schedule';
const EVENTS = 'events';

function pathBldr() {
	let args = [...arguments];
	return args.join('/');
}
const userPath = uid => `${USERS}/${uid}`;
const bandPath = bandId => `${BANDS}/${bandId}`;
const bandMembersPath = bandId => `${BANDS}/${bandId}/${MEMBERS}`;
const memberPath = (bandId, memberId) => `${BANDS}/${bandId}/${MEMBERS}/${memberId}`;
const bandToursPath = bandId => `${BANDS}/${bandId}/${TOURS}`;
const tourPath = (bandId, tourId) => `${bandPath(bandId)}/${TOURS}/${tourId}`;
const datePath = (bandId, tourId, dateId) => `${tourPath(bandId, tourId)}/${DATES}/${dateId}`;

function getPath(doc) {
	return `/${doc._path.segments.join('/')}`;
}

module.exports = {
	VENUES,
	BANDS,
	USERS,
	MEMBERS,
	TOURS,
	DATES,
	SCHEDULE,
	EVENTS,
	pathBldr,
	getPath,
	userPath,
	bandPath,
	bandMembersPath,
	memberPath,
	bandToursPath,
	tourPath,
	datePath,
};
