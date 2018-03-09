const normalize = require('./normalize');

module.exports = (app, request) => async (method, path, options) => {
  const res = await request(normalize(method, path, app.options.port, options));
  res.method = res.request.method;
  res.status = res.statusCode;
  if (/application\/json/.test(res.headers['content-type']) && typeof res.body === 'string') {
    res.rawBody = res.body;
    res.body = JSON.parse(res.body);
  }
  // console.log(app);
  res.ctx = app;
  return res;
};
