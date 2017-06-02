// The test suite and the different needed parts
module.exports = {

  // Generate a random port that is not already in use
  port: require('./helpers/port'),

  // Handle different types of requests
  launch: require('./launch'),
  handler: require('./handler'),

  getter: require('./getter'),
  poster: require('./poster'),

  persist: require('./persist'),

  // Handle a function that expects to be thrown
  throws: require('./throws')
};
