const normalize = require('../utils/normalize');
const params = require('path-to-regexp-wrap')();

module.exports = (...all) => {
  // Extracted or otherwise it'd shift once per call; also more performant
  const { path, middle } = normalize(all);
  const match = params(path);

  const generic = () => {};
  generic.error = async ctx => {

    // Only do this if the correct path
    ctx.error.code = ctx.error.code || '';
    ctx.error.params = match(ctx.error.code);

    // Add an extra-allowing initial matching
    if (!ctx.error.params && ctx.error.code.slice(0, path.length) !== path) return;

    const ret = await middle[0](ctx);
    delete ctx.error;
    return ret;
  };
  return generic;
};
