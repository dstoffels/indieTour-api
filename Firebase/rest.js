const { WEB_API_KEY } = require('./key.js');

// ENDPOINTS
const signInWithPassword = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`;

exports.signInWithPassword = signInWithPassword;
