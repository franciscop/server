// Default configuration for server
module.exports = {

  // Public variables - should be documented quite well
  port: 3000,
  engine: 'pug',
  public: 'public',
  secret: 'secret-' + parseInt(1000000 * Math.random()),



  // Dev variables - not part of the official API
  // Show extra info on the terminal; should depend on another variable
  verbose: false,

  // Avoid giving clues to server tech
  'x-powered-by': false
};
