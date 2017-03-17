const errors = require('human-error')({
  url: key => `https://serverjs.io/errors#${key.toLowerCase()}`
});

errors.PortAlreadyUsed = err => `
  The port "${err.port}" is already in use.
  Only a single server can be used per port.
  You have these options:
  - Change the port for the server such as "server({ port: 5000 });"
  - Find out what process is already using the port and stop it.
`;

module.exports = errors;
