# About server

## Motivation

I have taught Node.js + express.js to quite some people and there's always a point where I just have to say: "this part is way too complex to explain at this point, so just copy/paste this". This breaking point is connecting express.js to all those middlewares.

So when I was traveling with [Hacker Paradise](http://www.hackerparadise.org/) through Asia and we got to the same point I decided to do something about it. First I created a [*file upload middleware*](https://github.com/franciscop/express-data-parser) and then started the ground work for what now is *server*.

The trigger was really getting the package for `server` in NPM (thanks NPM!) during my trip. After that and based on the previous experiments, I decided to set out for real and make something worthwhile. So I dug into express.js, middleware, routers, etc and now I'm proud that **server is something I use** to make websites faster and easier.

[Join me in Github](https://github.com/franciscop/server) to get the best out of server and help Node.js achieve its full potential. Next up are websockets routes:

```js
const server = require('server');
const { get, socket } = server.router;
server(
  get('/', ctx => ctx.res.render('home')),
  socket('connect', ctx => ctx.io.emit(`Connected: ${ctx.socket.id}`))
);
```



## Goals

These are the main things that I wasn't happy with the state-of-the-art, so I decided to launch server to build upon the great work of express:

1. Make things work by default:
  - Cookies
  - Session
  - Form submission
  - Including **file uploads**
  - ...

2. Make things simpler to use
  - Many low-level things work out of the box
  - Sensible, secure defaults => no need to change anything
  - Easily customizable options

3. Make some important services available where possible, or some hooks to make it easier:
  - Passport
  - Database (MongoDB, etc)
  - Websockets

4. Better error handling (if possible). No more ALLCAPS error messages with no information at all.


This will in turn **make it much easier to get started**, for both people who are new to Node or for experienced people who don't want to set-up everything again and again. The main frustration that I've seen from people coming from:

- Different web backgrounds (Ruby on Rails, PHP), where now they have to hunt down and compare dozens of libraries to do simple tasks.
- Different programming backgrounds (Arduino, C++) where I have to explain not only how to get a server ready with these new tools, but also how the current state of the art and the fun of it is to build your own stack.
- Starting from scratch. I pity those people starting with no programming experience coming to Node.js. This shouldn't be so difficult, should it?


## Contribute

If you have some ideas of how Node.js development could be improved, please [open a new issue in Github's repository](github.com/franciscop/server/issues).



## Web design

This website was built with [Paperdocs](http://francisco.io/paperdocs/), a project built on top of [Picnic CSS](http://picnicss.com/) and [Umbrella JS](http://umbrellajs.com/) from the author of Server, [Francisco Presencia](http://francisco.io/).


## Hire me

I love using my work in real life and I'm available for contractor work. My freelancing helps keep `server` and [other open source projects](https://github.com/franciscop/) up to date! Hire me to do:

- Front-end: [Picnic CSS](http://picnicss.com/) ♦ [Paperdocs](http://francisco.io/paperdocs) ♦ [Angular Attack](http://angularattack.com/) ♦ [Ruby Rampage](https://www.rubyrampage.com/) ♦ [Server JS website](https://serverjs.io/)
- Full-stack: [Makers UPV](https://makersupv.com/) ♦ [Learning vocabulary](http://anchor.science/)
- Back-end: [Server JS (the library)](http://serverjs.io/) ♦ [Drive DB](https://github.com/franciscop/drive-db) ♦  [Express Data Parser](https://github.com/franciscop/express-data-parser)

Find my email [in my website](http://francisco.io/).
