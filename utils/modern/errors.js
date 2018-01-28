const error = require('../../error')('/server/modern/', {
  url: ({ id }) => `https://serverjs.io/documentation/errors/#${id}`
});

error.missingmiddleware = `
  modern() expects a middleware to be passed but nothing was passed.
`;

// error.MissingMiddleware = () => `
//   modern() expects a middleware to be passed but nothing was passed.
//`;


error.invalidmiddleware = ({ type }) => `
  modern() expects the argument to be a middleware function.
  "${type}" was passed instead
`;

// error.InvalidMiddleware = ({ type }) => `
//   modern() expects the argument to be a middleware function.
//   "${type}" was passed instead
// `;


error.errormiddleware = `
  modern() cannot create a modern middleware that handles errors.
  If you can handle an error in your middleware do it there.
  Otherwise, use ".catch()" for truly fatal errors as "server().catch()".
`;

// error.ErrorMiddleware = () => `
//   modern() cannot create a modern middleware that handles errors.
//   If you can handle an error in your middleware do it there.
//   Otherwise, use ".catch()" for truly fatal errors as "server().catch()".
// `;


error.missingcontext = `
  There is no context being passed to the middleware.
`;

// error.MissingContext = () => `
//   There is no context being passed to the middleware.
// `;


error.malformedcontext = ({ item }) => `
  The argument passed as context is malformed.
  Expecting it to be an object containing "${item}".
  This is most likely an error from "server.modern".
  Please report it: https://github.com/franciscop/server/issues
`;

// error.MalformedContext = ({ item }) => `
//   The argument passed as context is malformed.
//   Expecting it to be an object containing "${item}".
//   This is most likely an error from "server.modern".
//   Please report it: https://github.com/franciscop/server/issues
// `;


module.exports = error;
