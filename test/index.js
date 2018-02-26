// Launch the server, provide an API for it and close it as needed
const server = require('../');
const request = require('request-promises');
const port = require('./port');
const wait = require('./wait');
const serverOptions = require('./options');
const instance = require('./instance');
const generic = require('./generic');
const handler = require('./handler');


// Prepare a testing instance with the right options and middleware
const Test = function (...all) {

  // Normalize the request into options and middleware
  const { opts, middle } = server.utils.normalize(all);

  // Add options specific to testing like the port number
  this.opts = serverOptions(opts, module.exports.options, { port: port() });

  // Overload (if wanted) error handler to autorespond with a server error
  this.middle = this.opts.raw ? middle : [...middle, handler];

  // Some generic requests for quick one-offs
  this.get = (...req) => this.run(api => api.get(...req));
  this.post = (...req) => this.run(api => api.post(...req));
  this.put = (...req) => this.run(api => api.put(...req));
  this.del = (...req) => this.run(api => api.del(...req));

  // Persistent requests, but only per-instance!
  this.request = request.defaults({ jar: request.jar() });

  return this;
};



// Start running the server
Test.prototype.launch = async function (method, url, reqOpts) {

  const { opts, middle } = this;

  // This means it is a server instance
  // To FIX: it could be just the actual options
  this.launched = instance(opts);
  return this.launched ? await opts : await server(opts, middle);
};



// Keep the server alive for as long as the callback is being executed,
//  then close it if it started within this
Test.prototype.run = async function (cb) {

  // We want to close the app after launched AND propagate the error
  try {

    // Launch the app and set it to this.app
    this.app = await this.launch();

    // Need this await since we want to execute the cb within the try/catch. If
    //   we return a promise then it'd be the parent's responsibility
    return await cb({
      get: (...args) => generic(this.app, this.request)('GET', ...args),
      post: (...args) => generic(this.app, this.request)('POST', ...args),
      put: (...args) => generic(this.app, this.request)('PUT', ...args),
      del: (...args) => generic(this.app, this.request)('DELETE', ...args),
      ctx: this.app
    });

  // Close it if it was launched from the test runner, otherwise leave it free
  } finally {
    if (!this.launched && this.app) {
      this.app.close();
    }
  }
};


module.exports = (...args) => new Test(...args);
module.exports.options = {};

// Generate a random port that is not already in use
module.exports.port = port;
module.exports.wait = wait;
