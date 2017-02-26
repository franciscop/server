const server = require('../../server');
const { get, post } = server.router;
server(get('/', ctx => ctx.res.send('Hello 世界')));

server({ port: 3001, middle: false }, get('/', ctx => ctx.res.send('Hello 世界')));

const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello 世界'));
app.listen(2000);
