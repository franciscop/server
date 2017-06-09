const launch = require('server/test/launch');
const request = require('request-promises');

module.exports = async (middle, opts = {}, servOpts) => {

  // As they are loaded in parallel and from different files, we need to randomize it
  // The assuption here is under 100 tests/file
  const ctx = await launch(middle, servOpts);

  const options = Object.assign({}, {
    url: 'http://localhost:' + ctx.options.port + (opts.path || '/'),
    gzip: true
  }, opts);

  delete options.path;

  try {
    const res = await request(options);
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw new Error(`Invalid response code: ${res.statusCode}`);
    }
    ctx.close();
    return res;
  } finally {
    ctx.close();
  }
};
