const server = require('../');
const request = require('request-promises');
const serverOptions = require('./options');
const instance = require('./instance');

// Make an object with the options as expected by request()
const normalize = (method, url, port, options) => {

  // Make sure it's a simple object
  if (typeof options === 'string') options = { url: options };

  // Assign independent parts
  options = Object.assign({}, options, { url, method });

  // Make sure it has a right URL or localhost otherwise
  if (!/^https?:\/\//.test(options.url)) {
    options.url = `http://localhost:${port}${options.url}`;
  }

  // Set it to send a JSON when appropriate
  if (options.body && typeof options.body === 'object') {
    options.json = true;
  }

  // Finally return the fully formed object
  return options;
};




const Test = function (...all) {

  // Make sure we are working with an instance
  if (!(this instanceof Test)) {
    return new Test(...all);
  }

  // Normalize the request into options and middleware
  const { opts, middle } = server.utils.normalize(all);
  this.opts = opts;
  this.middle = middle;

  this.get = (url, options) => this.launch('GET', url, options);
  this.post = (url, options) => this.launch('POST', url, options);
  this.put = (url, options) => this.launch('PUT', url, options);
  this.del = (url, options) => this.launch('DELETE', url, options);

  return this;
};



// Prepare for testing by overloading the right options and middleware
Test.prototype.prepare = async function () {

  // Parse the server options
  this.opts = await serverOptions(this.opts, Test.options);

  // Overload the error handler to autorespond with a server error
  if (this.opts.raw) return;

  // Final error handler that will respond with 500 and error message if none was set
  this.middle.push(server.router.error(ctx => {
    if (ctx.res.headersSent) return;
    return server.reply.status(500).send(ctx.error.message);
  }));
};


// Start running the server
Test.prototype.launch = async function (method, url, reqOpts) {

  // Prepare for testing by overloading the right options and middleware
  await this.prepare();

  const { opts, middle } = this;

  // This means it is a server instance
  // To FIX: it could be just the actual options
  const isServer = await instance(opts);
  const ctx = isServer ? opts : await server(opts, middle);

  if (!method) return ctx;
  const res = await request(normalize(method, url, ctx.options.port, reqOpts));
  // Fix small bug. TODO: report it
  res.method = res.request.method;
  res.status = res.statusCode;
  res.options = ctx.options;
  if (/application\/json/.test(res.headers['content-type']) && typeof res.body === 'string') {
    res.rawBody = res.body;
    res.body = JSON.parse(res.body);
  }
  res.ctx = ctx;

  // Only close it if we launched this instance, otherwise leave it open
  if (!isServer) {
    await ctx.close();
  }

  // Return the response that happened from the server
  return res;
};

Test.prototype.alive = async function (cb) {
  let instance;
  try {
    instance = await this.launch();
    const port = instance.options.port;
    const requestApi = request.defaults({ jar: request.jar() });
    const generic = method => async (url, options) => {
      const res = await requestApi(normalize(method, url, port, options));
      res.method = res.request.method;
      res.status = res.statusCode;
      if (/application\/json/.test(res.headers['content-type']) && typeof res.body === 'string') {
        res.rawBody = res.body;
        res.body = JSON.parse(res.body);
      }
      // console.log(instance);
      res.ctx = instance;
      return res;
    };
    const api = {
      get: generic('GET'),
      post: generic('POST'),
      put: generic('PUT'),
      del: generic('DELETE'),
      ctx: instance
    };
    await cb(api);
  } catch (err) {
    if (!instance) {
      console.log(err);
    }
    throw err;
  } finally {
    instance.close();
  }
};

Test.options = {};

module.exports = Test;
