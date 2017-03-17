const errors = require('human-error')({
  url: key => `https://serverjs.io/errors#${key.toLowerCase()}`
});

errors.NotSoSecret = () => `
  Oh cmon! Don't use 'your-random-string-here' as your secret!
`;

module.exports = errors;
