const path = require('path');

const Reply = function () {
  this.stack = [];
  return this;
};

Reply.prototype.cookie = (...args) => {
  reply.stack.push(ctx => {

  });
  return reply;
};

Reply.prototype.download = (...args) => {

  // Guard clauses
  if (args.length < 1)
    throw new Error('file() expects a path');

  if (args.length > 2)
    throw new Error('file() expects a path and options but nothing else');

  let [file, opts = {}] = args;
  if (!path.isAbsolute(file)) {
    file = path.resolve(process.cwd(), file);
  }

  reply.stack.push(ctx => new Promise((resolve, reject) => {
    ctx.res.download(...args, err => err ? reject(err) : resolve());
  }));

  return reply;
};

Reply.prototype.end = (...args) => {
  reply.stack.push(ctx => {

  });
  return reply;
};



Reply.prototype.file = (...args) => {

  // Guard clauses
  if (args.length < 1)
    throw new Error('file() expects a path');

  if (args.length > 2)
    throw new Error('file() expects a path and options but nothing else');

  let [file, opts = {}] = args;
  if (!path.isAbsolute(file)) {
    file = path.resolve(process.cwd(), file);
  }

  reply.stack.push(ctx => new Promise((resolve, reject) => {
    ctx.res.sendFile(file, opts, err => err ? reject(err) : resolve());
  }));

  return reply;
};



Reply.prototype.header = (...args) => {
  reply.stack.push(ctx => {

  });
  return reply;
};

Reply.prototype.json = (...args) => {
  reply.stack.push(ctx => {

  });
  return reply;
};

Reply.prototype.jsonp = (...args) => {
  reply.stack.push(ctx => {

  });
  return reply;
};

Reply.prototype.redirect = (...args) => {
  reply.stack.push(ctx => {

  });
  return reply;
};

Reply.prototype.render = (...args) => {

  // Guard clauses
  if (args.length < 1)
    throw new Error('file() expects a path');

  if (args.length > 2)
    throw new Error('file() expects a path and options but nothing else');

  let [file, opts = {}] = args;

  reply.stack.push(ctx => new Promise((resolve, reject) => {
    // Note: if callback is provided, it does not send() automatically
    const cb = (err, html) => err ? reject(err) : resolve(ctx.res.send(html));
    ctx.res.render(file, opts, cb);
  }));
  return reply;
};

Reply.prototype.send = (...args) => {
  reply.stack.push(ctx => {
    if (args[0].req) {
      throw new Error('You should not return res()');
    }
    ctx.res.send(...args);
  });
  return reply;
};

Reply.prototype.status = function (...args) {
  reply.stack.push(ctx => {
    // In case there is no response, it'll respond with the status
    ctx.res.explicitStatus = true;
    ctx.res.status(...args);
  });
  return reply;
};

Reply.prototype.type = (...args) => {
  reply.stack.push(ctx => {

  });
  return reply;
};

Reply.prototype.exec = async function(ctx){
  for (let cb of reply.stack) {
    await cb(ctx);
  }
  reply.stack = [];
};

const reply = new Reply();

module.exports = reply;
