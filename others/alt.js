// THESE ARE JUST IDEAS; THEY MIGHT OR MIGHT NOT WORK

// Include the server in your file
let server = require('server');
let { get, post, config } = server.router;
let { send, json, file, render } = server.answer;

// This compares simple implementations; not expected to be the typical ones
// Initialize the server on port 3000
server(

  // +direct +simple +express +koa -WET
  get('/', ctx => ctx.res.send('hello 世界')),
  get('/', ctx => ctx.res.json({ hello: '世界' })),
  get('/', ctx => ctx.res.file('./public/index.html')),
  get('/', ctx => ctx.res.status(400).render('index.pug', {})),
  get('/user/:id', ctx => cache({}).then(db({})).then(render('user.pug'))),

  // +clean +standard +direct +chainable -complex(inside) -confusing
  get('/').send('hello 世界'),
  get('/').json({ hello: '世界' }),
  get('/').file('./public/index.html'),
  get('/').status(400).render('index.pug', {}),
  get('/user/:id').cache({}).db({}).render('user.pug')

  // +compatible +trivial -extra syntax -unchainable
  get('/', send('hello 世界')),
  get('/', json({ hello: '世 界' })),
  get('/', file('./public/index.html')),
  get('/', status(400), render('index.pug', {})),
  get('/user/:id', cache({}), db({}), render('user.pug'))

  // +promises -incompatible -wrapper -extra syntax -longest
  get('/').then(send('hello 世界')),
  get('/').then(json({ hello: '世界' })),
  get('/').then(file('./public/index.html')),
  get('/').then(status(400)).then(render('index.pug', {})),
);
