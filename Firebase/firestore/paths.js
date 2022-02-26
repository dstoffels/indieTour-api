// ROOT PATHS
const USERS = '/users';
const VENUES = '/venues';
const BANDS = '/bands';

// SUB PATHS
const TOURS = 'tours';
const DATES = 'dates';
const SCHEDULE = 'schedule';
const EVENTS = 'events';

function pathBldr() {
	let args = [...arguments];
	return args.join('/');
}

function getPath(doc) {
	return `/${doc._path.segments.join('/')}`;
}

module.exports = { USERS, VENUES, BANDS, TOURS, DATES, SCHEDULE, EVENTS, pathBldr, getPath };
