let server = require('../../server');
let { get, post } = server.router;

server(3000, get('/', (req, res) => { res.send("Hello 3000") }));
server(4000, get('/', (req, res) => { res.send("Hello 4000") }));
