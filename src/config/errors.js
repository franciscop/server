const errors = require('human-error');

errors.NotSoSecret = () => `
  Oh cmon! Don't use 'your-random-string-here' as your secret!
`;

module.exports = errors;
