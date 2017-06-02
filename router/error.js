const parse = require('./parse');

module.exports = (...all) => {
  // Extracted or otherwise it'd shift once per call; also more performant
  const { path, middle } = parse(all);
  const generic = () => {};
  generic.error = async ctx => {

    const fragment = (ctx.error.name || '').slice(0, path.length);

    // All of them if there's no path
    if (path === '*' || path === fragment) {
      const ret = await middle[0](ctx);
      delete ctx.error;
      return ret;
    }
  };
  return generic;
};
