// Default configuration for server
module.exports = {
  port: 3000,
  'view engine': 'pug',
  verbose: false,
  public: 'public',
  secret: 'secret-' + parseInt(1000000 * Math.random()),

  'x-powered-by': false   // Avoid giving clues to server tech
};
