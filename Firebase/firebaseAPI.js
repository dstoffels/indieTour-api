const { WEB_API_KEY } = require('./key.js');

// ENDPOINTS
exports.signInWithPassword = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`;
