// YOU MIGHT BE LOOKING FOR 'error.js' (without the "s")

const error = require('../error').defaults({
  url: ({ code }) => `https://serverjs.io/documentation/errors/#${
    code.toLowerCase().replace(/[^\w]+/g, '-')
  }`,
  status: 500
});

error['/server/test/router'] = 'This is a demo error';

error['/server/test/simplerouter'] = ({ text }) => `Simple message: ${text}`

module.exports = error;
