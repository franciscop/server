module.exports = {
  name: 'static',
  options: {
    __root: 'public',
    public: {
      type: String,
      inherit: 'public',
      env: false
    }
  },
  init: ctx => {
    module.exports.before = [
      ctx.utils.modern(ctx.express.static(ctx.options.static.public))
    ];
  }
};
