const ModernError = require('./errors');

exports.middleware = middle => {
  if (!middle) {
    throw new ModernError('missingmiddleware');
  }
  if (!(middle instanceof Function)) {
    throw new ModernError('invalidmiddleware', { type: typeof middle });
  }
  if (middle.length === 4) {
    throw new ModernError('errormiddleware');
  }
};

exports.context = ctx => {
  if (!ctx) {
    throw new ModernError('missingcontext');
  }
  if (!ctx.req) {
    throw new ModernError('malformedcontext', { item: 'res' });
  }
  if (!ctx.res) {
    throw new ModernError('malformedcontext', { item: 'res' });
  }
};
