
module.exports = {

  // Generate a random port that is not already in use
  port: require('./helpers/port'),

  // Handle different types of requests
  launch: require('./launch'),
  handler: require('./handler'),

  getter: require('./getter'),
  poster: require('./poster'),

  // Handle a function that expects to be thrown
  throws: require('./throws')
};
