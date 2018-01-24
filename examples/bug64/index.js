const server = require('../../');
const { get, error } = server.router;

const mid2 = ctx => {
  const err = new Error('No username detected');
  err.code = 'user.noname';
  throw err;
};

server(
  mid2,
  get('/', ctx=> json('hello world')),
  error('user', ctx => {
    console.log(ctx.error);
    return 'Matched! :)';
  }),
  error(ctx => {
    console.log(ctx.error);
    return 'Not matched! :(';
  })
);
