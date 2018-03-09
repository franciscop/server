const error = require('../../error')('/server/options', {
  url: ({ id }) => `https://serverjs.io/documentation/errors/#${id}`
});

error.notobject = `
  Your options must be an object as required by the options definition.
  If you are a developer and want to accept a single option, make sure
  to use the '__root' property.
`;

error.rootnotstring = `
  The __root property in your schema must be a string. If you are not developing
  a plugin, please report this as a bug.
`;

error.noobjectdef = ({ name, type }) => `
  The schema for the option "${name}" must be an object but instead received
  a ${type}
`;

error.noarg = ({ name }) => `
  The option '${name}' cannot be passed through the arguments of server. This
  might be because it's sensitive and it has to be set in the environment.
  Please read the documentation for '${name}' and make sure to set it correctly.
`;

error.noenv = ({ name }) => `
  The option '${name}' cannot be passed through the environment of server.
  Please read the documentation for '${name}' and make sure to set it correctly.
`;

error.required = ({ name }) => `
  The option '${name}' is required but it was not set neither as an argument nor
  in the environment. Please make sure to set it.
`;

error.type = ({ name, expected, received, value }) => `
  The option '${name}' should be a '[${typeof expected}]' but you passed a '${received}':
  ${JSON.stringify(value)}
`;

error.enum = ({ name, value, possible }) => `
  The option '${name}' has a value of '${value}' but it should have one of these values:
  ${JSON.stringify(possible)}
`;

error.validate = ({ name, value }) => `
  Failed to validate the option '${name}' with the value '${value}'. Please
  consult this option documentation for more information.
`;

error.secretexample = `
  It looks like you are trying to use 'your-random-string-here' as the secret,
  just as in the documentation. Please don't do this! Create a strong secret
  and store it in your '.env'.
`;

error.secretgenerated = `
  Please change the secret in your environment configuration.
  The default one is not recommended and should be changed.
  More info in https://serverjs.io/errors#defaultSecret
`;

module.exports = error;
