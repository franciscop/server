const ModernError = require('./errors');

exports.middleware = middle => {
  if (!middle) {
    throw new ModernError('/server/modern/missingmiddleware');
  }
  if (!(middle instanceof Function)) {
    throw new ModernError('/server/modern/invalidmiddleware', { type: typeof middle });
  }
  if (middle.length === 4) {
    throw new ModernError('/server/modern/errormiddleware');
  }
};

exports.context = ctx => {
  if (!ctx) {
    throw new ModernError('/server/modern/missingcontext');
  }
  if (!ctx.req) {
    throw new ModernError('/server/modern/malformedcontext', { item: 'res' });
  }
  if (!ctx.res) {
    throw new ModernError('/server/modern/malformedcontext', { item: 'res' });
  }
};
