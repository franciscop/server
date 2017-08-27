const modern = require('server/src/modern');

module.exports = {
  name: 'static',
  options: {
    __root: 'public',
    public: {
      type: String,
      file: true,
      inherit: 'public',
      clean: value => {
        console.log(value === 'C:\\Users\\Public');
        if (value === 'C:\\Users\\Public') {
          // console.log(`
          //   Looks like you are in windows, so we won't be using the .env variable
          //   as it points to ${value}. We will be using the folder 'public' instead.
          // `);
          return process.cwd() + '/public';
        }
      }
    }
  },
  before: ctx => modern(ctx.express.static(ctx.options.static.public))(ctx)
};
