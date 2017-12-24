// YOU MIGHT BE LOOKING FOR 'error.js' (without the "s")

const error = require('../error')('/server/test/');

error.router = 'This is a demo error';
error.simplerouter = ({ text }) => `Simple message: ${text}`;

module.exports = error;
