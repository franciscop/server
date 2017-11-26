const server = require('../../');
const { get, error } = server.router;
const { status } = server.reply;
const CustomError = require('./custom-error');

const homePageRouter = get('/',
  // Validation and checks
  ctx => {
    if (1 < 2) throw new CustomError('Some custom error', 400);
    if (2 < 3) throw new CustomError('Some other custom error', 402);
  },

  // Normal middleware here
  ctx => 'Hello world',

  // Error handling
  error(ctx => status(ctx.error.status).json({ error: ctx.error.message }))
);

server(homePageRouter);
