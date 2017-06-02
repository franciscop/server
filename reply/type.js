const Reply = require('./reply');

module.exports = (...args) => new Reply('type', ...args);
