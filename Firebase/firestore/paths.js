// ROOT PATHS
const VENUES = '/venues';
const BANDS = '/bands';

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

const bandPath = bandId => `${BANDS}/${bandId}`;
const memberPath = (bandId, memberId) => `${BANDS}/${bandId}/${MEMBERS}/${memberId}`;
const tourPath = (bandId, tourId) => `${bandPath(bandId)}/${TOURS}/${tourId}`;
const datePath = (bandId, tourId, dateId) => `${tourPath(bandId, tourId)}/${DATES}/${dateId}`;

function getPath(doc) {
	return `/${doc._path.segments.join('/')}`;
}

module.exports = {
	VENUES,
	BANDS,
	MEMBERS,
	TOURS,
	DATES,
	SCHEDULE,
	EVENTS,
	pathBldr,
	getPath,
	bandPath,
	memberPath,
	tourPath,
	datePath,
};
