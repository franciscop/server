const server = require('../');
const request = require('request-promises');
const port = require('./port');

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



// Parse the server options
const serverOptions = async middle => {
  // First parameter can be:
  // - options: Number || Object (cannot be ID'd)
  // - middleware: undefined || null || Boolean || Function || Array
  let opts = (
    typeof middle[0] === 'undefined' ||
    typeof middle[0] === 'boolean' ||
    typeof middle[0] === 'string' ||
    middle[0] === null ||
    middle[0] instanceof Function ||
    middle[0] instanceof Array
  ) ? {} : middle.shift();

  // In case the port is the defaults one
  let synthetic = !opts || !opts.port;
  await opts;

  // Create the port when none was specified
  if (synthetic) opts.port = port();

  // Be able to set global variables from outside
  opts = Object.assign({}, opts, module.exports.options || {}, {
    env: undefined,
    secret: undefined
  });

  return opts;
};



module.exports = function (...middle) {

  // Make sure we are working with an instance
  if (!(this instanceof (module.exports))) {
    return new (module.exports)(...middle);
  }

  const launch = async (method, url, reqOpts) => {

    // Parse the server options
    const opts = await serverOptions(middle);

    const error = server.router.error(ctx => {
      if (!ctx.res.headersSent) {
        return server.reply.status(500).send(ctx.error.message);
      }
    });

    const ctx = await server(opts, middle, opts.raw ? false : error);

    ctx.close = () => new Promise((resolve, reject) => {
      ctx.server.close(err => err ? reject(err) : resolve());
    });
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

    // Close the server once it has all finished
    await ctx.close();

    // Return the response that happened from the server
    return res;
  }

  this.alive = async cb => {
    let instance;
    try {
      instance = await launch();
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
  this.get = (url, options) => launch('GET', url, options);
  this.post = (url, options) => launch('POST', url, options);
  this.put = (url, options) => launch('PUT', url, options);
  this.del = (url, options) => launch('DELETE', url, options);
  return this;
};


module.exports.options = {};
