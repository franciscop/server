const Reply = require('./reply');

module.exports = (...args) => new Reply('header', ...args);
