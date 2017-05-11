const server = require('../../server');
const { get, post } = server.router;
const { render } = server.reply;

server(ctx => render('index'));
