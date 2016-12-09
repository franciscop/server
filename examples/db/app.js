let server = require('../../server');
let { get, post } = server.router;

server(3000, get('/', (req, res) => res.render('index')));
