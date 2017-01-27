const errors = require('human-error')({
  url: key => `https://serverjs.io/errors/${key}`
});

errors.MissingMiddleware = () => `
  modern() expects a middleware to be passed, but you passed nothing.
`;

errors.InvalidMiddleware = ({ type }) => `
  modern() expects the argument to be a middleware function.
  ${type ? `"${type}" was passed instead.` : ''}
`;

errors.MissingContext = () => `
  There is no context being passed to the middleware.
`,

errors.MalformedContext = ({ item = 'req" and "res' }) => `
  The argument passed as context is malformed.
  Expecting it to be an object containing "${item}".
  This is most likely an error from "server.modern".
  Please report it: https://github.com/franciscop/server/issues
`;

module.exports = errors;
