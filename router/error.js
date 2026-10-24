const join = require('../src/join');
const parse = require('./parse');
const { match } = require('path-to-regexp');

const decode = decodeURIComponent;

module.exports = (...all) => {
  // Extracted or otherwise it'd shift once per call; also more performant
  const { path, middle } = parse(all);

  // Convert to the proper path, since the new ones use `(.*)` instead of `*`
  const parsePath = match(path.replace(/\*/g, '(.*)'), { decode: decode });

  const generic = () => {};
  generic.error = async ctx => {

    // Only do this if the correct path
    ctx.error.code = ctx.error.code || '';
    ctx.error.params = parsePath(ctx.error.code).params;

    // Add an extra-allowing initial matching
    if (!ctx.error.params && ctx.error.code.slice(0, path.length) !== path) return;

    const ret = await middle[0](ctx);
    delete ctx.error;
    return ret;
  };
  return generic;
};
