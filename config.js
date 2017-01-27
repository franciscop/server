// Default configuration
module.exports = {
  port: 3000,
  public: 'public',
  'view engine': 'pug',
  verbose: false,

  middle: {
    bodyParser: { extended: true },
    session: {
      resave: false,
      saveUninitialized: true,
      cookie: {}
    }
  }
};
