// Router
// A router is a code piece that takes a context and properly handles it
// or passes it around


// Inspiration: https://chatbotslife.com/create-your-own-bot-for-github-part-2-bc8b5267a280
const server = require('server').plug('server-github-bot');
const { github } = server.router;

server({
  github: {
    repo: 'franciscop/server'
    token: 'xxxxxx-xxxxxx'
  }
}, [
  github('CreateEvent', ctx => {

  })
]);
