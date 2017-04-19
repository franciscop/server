const server = require('server').plug('@server/next');
const { get } = server.router;
const { render } = server.reply;

const sub = ctx => render('/b', {
  subreddit: ctx.req.params.subreddit
});

server(get('/r/:subreddit', sub));





const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/r/:subreddit', (req, res) => {
    return app.render(req, res, '/b', {
      ...req.query,
      subreddit: req.params.subreddit
    })
  })

  server.get('*', handle)
  server.listen(3000)
})
