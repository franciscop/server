const error = require('../../error').defaults({
  url: ({ code }) => `https://serverjs.io/documentation/errors/#${
    code.toLowerCase().replace(/[^\w]+/g, '-')
  }`,
  status: 500
});

error['/server/options/notobject'] = `
  Your options must be an object as required by the options definition.
  If you are a developer and want to accept a single option, make sure
  to use the '__root' property.
`;

error['/server/options/noarg'] = ({ name }) => `
  The option '${name}' cannot be passed through the arguments of server. This
  might be because it's sensitive and it has to be set in the environment.
  Please read the documentation for '${name}' and make sure to set it correctly.
`;

error['/server/options/noenv'] = ({ name }) => `
  The option '${name}' cannot be passed through the environment of server.
  Please read the documentation for '${name}' and make sure to set it correctly.
`;

error['/server/options/cannotextend'] = ({ type, name }) => `
  The option "${name}" must be an object but it received "${type}".
  Please check your options to make sure you are passing an object.
${type === 'undefined' ? `
  If you are the creator of the plugin and you are receiving 'undefined', you
  could allow for the default behaviour to be an empty object 'default: {}'
` : ''}
`;

error['/server/options/required'] = ({ name }) => `
  The option '${name}' is required but it was not set neither as an argument nor
  in the environment. Please make sure to set it.
`;

error['/server/options/type'] = ({ name, expected, received, value }) => `
  The option '${name}' should be a '[${typeof expected}]' but you passed a '${received}':
  ${JSON.stringify(value)}
`;

error['/server/options/enum'] = ({ name, value, possible }) => `
  The option '${name}' has a value of '${value}' but it should have one of these values:
  ${JSON.stringify(possible)}
`;

error['/server/options/validate'] = ({ name, value }) => `
  Failed to validate the option '${name}' with the value '${value}'. Please
  consult this option documentation for more information.
`;

error['/server/options/secret/example'] = `
  It looks like you are trying to use 'your-random-string-here' as the secret,
  just as in the documentation. Please don't do this! Create a strong secret
  and store it in your '.env'.
`;

error['/server/options/secret/generated'] = `
  Please change the secret in your environment configuration.
  The default one is not recommended and should be changed.
  More info in https://serverjs.io/errors#defaultSecret
`;

module.exports = error;
