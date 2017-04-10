const server = require('server');
const { get, post } = server.router;
const { json, send, text, render, status } = server.reply;

const routes = [

  // Same:
  get('/', send('Hello world')),
  get('/', ctx => send('Hello world')),
  get('/', ctx => {
    return send('Hello world');
  }),

  // Same:
  get('*', status(404).render('notfound')),
  get('*', ctx => status(404).render('notfound')),
  get('*', ctx => {
    return status(404).render('notfound')
  }),

  // No equivalent
  get('/user', async ctx => {
    const users = await user.find().exec();
    return render('userlist', users);
  }),
];

server();
