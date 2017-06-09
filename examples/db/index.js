const server = require('../../server');
const { render } = server.reply;

server(ctx => render('index'));
