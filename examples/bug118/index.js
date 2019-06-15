const server = require("../../");
const { get, error } = server.router;

server(get("/", ctx => "Hello world"));
