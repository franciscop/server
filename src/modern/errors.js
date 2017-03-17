const errors = require('human-error')({
  url: key => `https://serverjs.io/errors/${key.toLowerCase()}`
});

errors.MissingMiddleware = () => `
  modern() expects a middleware to be passed but nothing was passed.
`;

errors.InvalidMiddleware = ({ type }) => `
  modern() expects the argument to be a middleware function.
  "${type}" was passed instead
`;

errors.ErrorMiddleware = () => `
  modern() cannot create a modern middleware that handles errors.
  If you can handle an error in your middleware do it there.
  Otherwise, use ".catch()" for truly fatal errors as "server().catch()".
`;

errors.MissingContext = () => `
  There is no context being passed to the middleware.
`;

errors.MalformedContext = ({ item }) => `
  The argument passed as context is malformed.
  Expecting it to be an object containing "${item}".
  This is most likely an error from "server.modern".
  Please report it: https://github.com/franciscop/server/issues
`;

module.exports = errors;
