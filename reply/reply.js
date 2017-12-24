const path = require('path');
const fs = require('mz/fs');


const Reply = function (name, ...args) {
  this.stack = [];
  this[name](...args);
  return this;
};



Reply.prototype.cookie = function (...args) {
  this.stack.push(ctx => {
    ctx.res.cookie(...args);
  });
  return this;
};



Reply.prototype.download = function (...args) {

  // Guard clauses
  if (args.length < 1) {
    throw new Error('download() expects a path as the first argument');
  }

  if (args.length < 2) {
    throw new Error('download() expects a filename as the second argument');
  }

  if (args.length > 2) {
    throw new Error('download() only expects two arguments, path and filename. The rest of them will be ignored');
  }

  let [file, opts] = args;
  if (!path.isAbsolute(file)) {
    file = path.resolve(process.cwd(), file);
  }

  this.stack.push(async ctx => {
    if (!await fs.exists(file)) {
      throw new Error(`The file "${file}" does not exist. Make sure that you set an absolute path or a relative path to the root of your project`);
    }
    return new Promise((resolve, reject) => {
      ctx.res.download(file, opts, err => err ? reject(err) : resolve());
    });
  });

  return this;
};



Reply.prototype.end = function () {
  this.stack.push(ctx => {
    ctx.res.end();
  });
  return this;
};



Reply.prototype.file = function (...args) {

  // Guard clauses
  if (args.length < 1) {
    throw new Error('file() expects a path as the first argument');
  }

  if (args.length > 2) {
    throw new Error(`file() only expects two arguments, the path and options, but ${args.length} were provided.`);
  }

  let [file, opts = {}] = args;
  if (!path.isAbsolute(file)) {
    file = path.resolve(process.cwd(), file);
  }

  this.stack.push(async ctx => {
    if (!await fs.exists(file)) {
      throw new Error(`The file "${file}" does not exist. Make sure that you set an absolute path or a relative path to the root of your project`);
    }
    return new Promise((resolve, reject) => {
      ctx.res.sendFile(file, opts, err => err ? reject(err) : resolve());
    });
  });

  return this;
};



Reply.prototype.header = function (...args) {
  this.stack.push(ctx => {
    ctx.res.header(...args);
  });
  return this;
};

Reply.prototype.json = function (...args) {
  this.stack.push(ctx => {
    ctx.res.json(...args);
  });
  return this;
};

Reply.prototype.jsonp = function (...args) {
  this.stack.push(ctx => {
    ctx.res.jsonp(...args);
  });
  return this;
};

Reply.prototype.redirect = function (...args) {
  this.stack.push(ctx => {
    ctx.res.redirect(...args);
  });
  return this;
};

Reply.prototype.render = function (...args) {

  // Guard clauses
  if (args.length < 1) {
    throw new Error('file() expects a path');
  }

  if (args.length > 2) {
    throw new Error('file() expects a path and options but nothing else');
  }

  let [file, opts = {}] = args;

  this.stack.push(ctx => new Promise((resolve, reject) => {
    // Note: if callback is provided, it does not send() automatically
    const cb = (err, html) => err ? reject(err) : resolve(ctx.res.send(html));
    ctx.res.render(file, opts, cb);
  }));
  return this;
};

Reply.prototype.send = function (...args) {

  // If we are trying to send the context
  if (args[0] && args[0].close && args[0].close instanceof Function) {
    throw new Error('Never send the context, request or response as those are a security risk');
  }

  this.stack.push(ctx => {
    ctx.res.send(...args);
  });
  return this;
};

Reply.prototype.status = function (...args) {
  this.stack.push(ctx => {
    // In case there is no response, it'll respond with the status
    ctx.res.explicitStatus = true;
    ctx.res.status(...args);
  });
  return this;
};

Reply.prototype.type = function (...args) {
  this.stack.push(ctx => {
    ctx.res.type(...args);
  });
  return this;
};

Reply.prototype.exec = async function (ctx) {
  for (let cb of this.stack) {
    await cb(ctx);
  }
  this.stack = [];
};

// This will make that the first time a function is called it starts a new stack
module.exports = Reply;
