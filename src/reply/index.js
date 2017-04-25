const path = require('path');
const fs = require('mz/fs');
const assert = require('assert');

exports.send = (...args) => ctx => {
  ctx.res.send(...args);
};

exports.file = (...args) => {

  assert(args.length >= 1, 'file() expects a path');
  assert(args.length <= 2, 'file() expects two arguments top');

  let [file, opts = {}] = args;

  if (!path.isAbsolute(file)) {
    file = path.resolve(process.cwd(), file);
  }

  return ctx => new Promise((resolve, reject) => {
    ctx.res.sendFile(file, opts, err => err ? reject(err) : resolve());
  });
};


exports.render = (...args) => {

  assert(args.length >= 1, 'file() expects a view name');
  assert(args.length <= 2, 'file() expects two arguments top');

  let [file, opts = {}] = args;

  return ctx => new Promise((resolve, reject) => {
    const callback = (err, html) => err ? reject(err) : resolve(html);
    ctx.res.render(file, opts, callback);
  });
};

exports.download = (...args) => {

  assert(args.length >= 1, 'file() expects a view name');
  assert(args.length <= 2, 'file() expects two arguments top');

  let [file, name] = args;

  if (!path.isAbsolute(file)) {
    file = path.resolve(process.cwd(), file);
  }

  return ctx => new Promise((resolve, reject) => {
    const callback = (err, html) => err ? reject(err) : resolve(html);
    ctx.res.download(file, name, callback);
  });
};
