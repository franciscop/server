const errors = require('human-error')({
  url: key => `https://serverjs.io/errors#${key}`
});

errors.PortAlreadyUsed = (err) => `
  The port "${err.port}" is already in use. You can launch a Node.js server per port.
  You have these options:
  - Change the port Node.js
  - Find out what process is already using the port
`;

module.exports = errors;
