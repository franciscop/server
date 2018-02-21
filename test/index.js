// Generate a random port that is not already in use
const port = require('./port');








// Launch the server, provide an API for it and close it as needed
module.exports = require('./run');

module.exports.port = port;
