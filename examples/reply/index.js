const server = require('../../server');
const { get } = server.router;
const { status, file, render, download } = server.reply;

const links = [
  'text', 'html', 'json_arr', 'json_obj', 'file', 'render', 'status',
  'download', 'mixed'
];

server([
  get('/', ctx => `Try:<br>${links.map(link => `<a href="/${link}">/${link}<a>`).join('<br>')}`),

  // Base:
  get('/text', ctx => 'Hello 世界'),
  get('/html', ctx => '<p>He<strong>llo</strong> 世界</p>'),
  get('/json_arr', ctx => ['a', 'b', 'c']),
  get('/json_obj', ctx => ({ a: 'b', c: 'd' })),

  // Needed:
  get('/file', ctx => file('data.txt')),
  get('/render', ctx => render('index.pug')),
  get('/download', ctx => download('data.txt', 'my file.txt')),

  // Concatenable:
  get('/status', ctx => status(200)),
  get('/mixed', ctx => status(201).file('data.txt')),
]);
