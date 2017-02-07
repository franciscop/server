// Include the server in your file
let server = require('server');
let { get, post, config } = server.router;
let { send, json, file, render } = server.answer;

// Initialize the server on port 3000
server({ port: 3000 },

  // default
  get('/', (req, res) => res.send('hello 世界')),
  get('/', (req, res) => res.json({ hello: '世界' })),
  get('/', (req, res) => res.file('./public/index.html')),
  get('/', (req, res) => res.status(400).render('index.pug', {})),

  // +clean +standard +direct +chainable -complex(inside)
  get('/').send('hello 世界'),
  get('/').json({ hello: '世界' }),
  get('/').file('./public/index.html'),
  get('/').status(400).render('index.pug', {}),

  // +compatible +trivial -extra syntax -unchainable
  get('/', send('hello 世界')),
  get('/', json({ hello: '世界' })),
  get('/', file('./public/index.html')),
  get('/', status(400), render('index.pug', {})),

  // +promises -incompatible -wrapper -extra syntax -longest
  get('/').then(send('hello 世界')),
  get('/').then(json({ hello: '世界' })),
  get('/').then(file('./public/index.html')),
  get('/').then(status(400)).then(render('index.pug', {})),
);
