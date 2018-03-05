module.exports = {
  name: 'static',
  options: {
    __root: 'public',
    public: {
      type: String,
      inherit: 'public',
      env: 'STATIC_PUBLIC'
    }
  },
  init: ctx => {
    module.exports.before = [
      ctx.utils.modern(ctx.express.static(ctx.options.static.public))
    ];
  }
};
