const server = require('../../server');
const { get } = server.router;

module.exports = server(get('/user', () => ({ name: 'john' })));
