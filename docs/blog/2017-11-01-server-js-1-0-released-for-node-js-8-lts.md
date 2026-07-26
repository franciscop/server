---
title: Server.js 1.0 released, for Node.js 8 LTS
description: I released the first official version of server.js, a library to make developing a web server in Node.js a lot easier. Based on express, socket.io, helmet and m
date: 2017-11-01
tag: Blog
---

> I released [the first official version of server.js](https://serverjs.io/), a library to make developing a web server in Node.js a lot easier. Based on [express](https://expressjs.com/), [socket.io](https://socket.io/), [helmet](https://helmetjs.github.io/) and more.

One year ago I had a problem and I decided to solve it. I was teaching Node.js in a workshop with [Hacker Paradise](https://www.hackerparadise.org/) and I got to the point where I normally say:

> This code is too complex to explain at this point, so let’s just copy/paste it and continue.

That part was when adding all of the middleware to make Express have bodyparser, sessions, cookies, etc. I thought it’d be really nice to have this set of basic functionality working for everyone by default.

Now with server I’d do this and have a fully working website:

```js
const server = require('server');
const { get, post } = server.router;
```

```js
server(
  get(ctx => 'Hello world'),
  post(ctx => console.log(ctx.data))
);
```

> [Getting a great npm name](https://medium.com/server-for-node-js/getting-a-great-npm-name-b0b2b27a0e1b)

## Modern javascript

Another thing that I didn’t like about Node.js programming is [Callback Hell](http://callbackhell.com/). With Await/Async this is easily solved. Let’s say a simple scrapper that saves the links of the passed url into a database and replies to it:

```js
const server = require('server');
const { get, post } = server.router;
const { render, json } = server.reply;
const fetch = require('node-fetch');
```

```js
// Up to you how to implement these (Cheerio + MongoDB?)
const scrapeLinks = require('./fetch-links');
const saveLinks = require('./save-links');
```

```js
server(
  get(ctx => render('index.jade')),
  post(async ctx => {
    const saved = await Links.find({ url: ctx.data }).exec();
    if (saved.length) return json(saved);
    const body = await fetch(ctx.data).then(res => res.text());
    const links = scrapeLinks(body);
    await saveLinks(ctx.data.url, links);
    return json(links);
  })
);
```

That’s the main logic for it. Quite intuitive and direct compared to the callback way. [Async/await are truly awesome](https://medium.com/server-for-node-js/async-await-are-awesome-c0834cc09ab).

## Achievements

These are the things I am most proud of, from a personal point of view and for the project itself.

I could make **the library that I enjoy** and use for my personal projects. It is easy and intuitive. I found many bugs and edge cases from daily use and [would love that you report any bug](https://github.com/franciscop/server) that you might find.

While neither of them officially released, it has great **socket.io** integration and a **powerful plugin system**. That is on top of being backwards-compatible with any [Express middleware](https://serverjs.io/documentation/#express-middleware) that you can find, a big win IMO.

[The Documentation](https://serverjs.io/documentation/) has seen a lot of care and hard work. I will do my best to separate it into a different module in the future to be able to redistribute it and use on other projects. [Want some nice docs like those? Hire me](https://documentation.agency/).

## Things I’d change

Make it **sooner**! I didn’t expect it to take a full year. I knew it was a longer project, but I expected to release it 3-6 months ago. The two main reasons are life, which got in the way, and me trying to make it future-proof.

Get **more people using it sooner**. When I teach web programming to friends I still follow express route. However I know that if I am spending my time teaching friends and acquaintances they won’t care or they’d even be happy to give me a hand on this.

## Next steps

First to take a small break. If it becomes popular it’s probably going to be short, but I’d like to explore some other areas for a bit.

Then, the main priority is expanding the documentation and tutorials. This is **a lot** of work but IMO one of the best return of investment for any library. If they cannot find it, it doesn’t exist kind of thing.

Finally, make a plan and look forward for the 1.1. This will include official socket.io and the full plugin system. Also, some pre-made plugins such as an auth one, sass, react, etc.

## Looking for Sponsors

I’m also looking for sponsors for the project. It doesn’t get many visits but surprisingly it gets a [decent and steadily growing number of installs](https://npm-stat.com/charts.html?package=server). So this looks like a small but passionate userbase, feel free to sponsor the project: [Sponsor website](https://serverjs.io/sponsor/)**.**

### Please let me know what what you create:

## [Server.js website](https://serverjs.io/), [Documentation](https://serverjs.io/documentation/) & [Tutorials](https://serverjs.io/tutorials/)

~happy hacking ♥

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=12a419ab187a)

---

[Server.js 1.0 released, for Node.js 8 LTS](https://medium.com/server-for-node-js/server-js-1-0-released-12a419ab187a) was originally published in [Server for Node.js](https://medium.com/server-for-node-js) on Medium, where people are continuing the conversation by highlighting and responding to this story.

---

_Originally published on [Medium](https://medium.com/server-for-node-js/server-js-1-0-released-12a419ab187a)._
