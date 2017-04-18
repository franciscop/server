const server = require('server');
const render = server.render;

// Return values:
// - Boolean =>
// - Number => status
// - String => html/text
// - Buffer => file
// - Object => json
// - Error => 500
// - Array => json
// - Function => call it

// Simple
server(ctx => 'Hello 世界');
server(ctx => async fs.readFile('data.txt').split('\n'));
server(ctx => new Error('Server error'));

// Elaborated
server(ctx => render('filename.pug'));
server(ctx => render('filename.hbs'));
