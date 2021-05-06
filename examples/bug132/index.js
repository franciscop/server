const server = require('../../');

const { get } = server.router;
const { status } = server.reply;

server([get(ctx => status(404))]);
