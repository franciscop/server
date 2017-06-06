const Reply = require('./reply');

module.exports = (...args) => new Reply('download', ...args);
