module.exports = {
  public: 'public',
  bodyParser: { extended: true },
  jsonParser: {},
  dataParser: {},
  cookieParser: {},
  compress: {},
  session: {
    resave: false,
    saveUninitialized: true,
    cookie: {}
  },
  responseTime: {},
  methodOverride: {},
  csrf: {}
};
