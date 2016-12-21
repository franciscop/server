// Default configuration
module.exports = opts => ({
  port: 3000,
  public: './public',
  viewengine: opts.viewengine || opts['view engine'] || 'pug',
  verbose: false,

  middle: {
    bodyparser: { extended: true },
    dataparser: {},
    session: {
      secret: 'giergosoganvdmvwevnewfnweflknewlfk',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true }
    },
    cookies: {}
  }
});
