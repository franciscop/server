const errors = require('./errors');

exports.middleware = middle => {
  if (!middle) {
    throw errors.MissingMiddleware();
  }
  if (!(middle instanceof Function)) {
    throw errors.InvalidMiddleware({ type: typeof middle });
  }
  if (middle.length === 4) {
    throw errors.ErrorMiddleware();
  }
};

exports.context = ctx => {
  if (!ctx) {
    throw errors.MissingContext();
  }
  if (!ctx.req) {
    throw errors.MalformedContext({ item: 'req' });
  }
  if (!ctx.res) {
    throw errors.MalformedContext({ item: 'res' });
  }
};
