---
title: About server.js
description: I have taught Node.js + express.js to quite some people and there’s always a point where I just have to say: “this part is way too complex to explain at this po
date: 2017-06-20
tag: Blog
---

I have taught Node.js + express.js to quite some people and there’s always a point where I just have to say: “this part is way too complex to explain at this point, so just copy/paste this”. This breaking point is connecting express.js to all those middlewares.

When I was [traveling with Hacker Paradise](http://www.hackerparadise.org/) through Asia and we got to the same point I decided to do something about it. First I created a [file upload middleware](https://github.com/franciscop/express-data-parser) and then started the ground work for what now is _server_.

The final trigger was [getting the package ](https://medium.com/server-for-node-js/getting-a-great-npm-name-b0b2b27a0e1b)[server in npm](https://medium.com/server-for-node-js/getting-a-great-npm-name-b0b2b27a0e1b). After that and based on the previous experiments, I decided to set out for real and make something worthwhile. So I dug into express.js, middleware, routers, etc and now I'm proud that **server is something I use** to make websites faster and easier.

[Join me in Github](https://github.com/franciscop/server) to get the best out of server and help Node.js achieve its full potential. Next up are websockets routes:

```js
const server = require('server');
const { get, socket } = server.router;
server(
  get('/', ctx => ctx.res.render('home')),
  socket('connect', ctx => ctx.io.emit('connected', ctx.socket.id)),
  socket('message', ctx => ctx.io.emit('message', ctx.data))
);
```

## Goals

These are the main things that I wasn’t happy with the state-of-the-art, so I decided to launch server to build upon the great work of express:

1. Make things work by default (by domain):

- Parsers: json, urlencoded, **file uploads**, etc.
- Persistence: session, cookies, csrf, etc

2. Make things simpler to use:

- Many low-level things work out of the box
- Sensible, secure defaults => no need to change anything
- Easily customizable options

3. Make some important services available where possible, or some hooks to make it easier:

- Passport
- Database (MongoDB, etc)
- Websockets

4. Better error handling (if possible). No more ALLCAPS error messages with no information at all.

This will in turn **make it much easier to get started**, for both people who are new to Node or for experienced people who don’t want to set-up everything again and again. The main frustration that I’ve seen from people coming from:

- Different web backgrounds (Ruby on Rails, PHP), where now they have to hunt down and compare dozens of libraries to do simple tasks.
- Different programming backgrounds (Arduino, C++) where I have to explain not only how to get a server ready with these new tools, but also how the current state of the art and the fun of it is to build your own stack.
- Starting from scratch. I pity those people starting with no programming experience coming to Node.js. This shouldn’t be so difficult, should it?

So that’s it, those are the reasons for me to start server.js. [Star the package in Github](https://github.com/franciscop/server) if you like it and check all the info in the [official website](https://serverjs.io/).

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=87e1df90a5c0)

---

[About server.js](https://medium.com/server-for-node-js/about-server-js-87e1df90a5c0) was originally published in [Server for Node.js](https://medium.com/server-for-node-js) on Medium, where people are continuing the conversation by highlighting and responding to this story.

---

_Originally published on [Medium](https://medium.com/server-for-node-js/about-server-js-87e1df90a5c0)._
