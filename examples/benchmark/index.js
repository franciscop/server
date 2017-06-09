const server = require('../../server');
const { get } = server.router;

server({ port: 3001, middle: false }, get('/', ctx => 'Hello 世界'));

const express = require('express');
const app = express();
app.get('/', ctx => 'Hello 世界');
app.listen(2000);
