---
title: Server.js beta 1 released
description: This release marks the end of a way longer than expected development cycle and the first public release for testing. The core functionality for this version is 
date: 2017-06-09
tag: Blog
---

This release marks the end of a way longer than expected development cycle and the first public release for testing. [The core functionality](https://github.com/franciscop/server/blob/master/api.js) for this version is released and will be kept compatible for the full 1.x cycle.

After 50 alpha releases, since NPM asked me not to publish 0.x versions, I am proud to release the first public-testing **beta** release. Feel free to [install and use it](https://serverjs.io/) under the permissive MIT license:

```js
const server = require('server');
const { get, post } = server.router;
```

```js
server(
  get('/', () => 'Hello 世界'),
  get('/html', () => '<p>I am a <strong>paragraph</strong>!</p>'),
  post('/', ctx => console.log(ctx.data))
);
```

## Test release

The code is in a good state to be used right now and with your help I’ll be able to make it production-ready for the final 1.0.0. Right now it should work with Linux, macOS and Windows.

There are few things missing from the documentation so I do recommend everyone to use server.js only for small projects right now. But please do so, break it and [report it](https://github.com/franciscop/server/issues/) so I can fix it!

If you have any questions about how to do something just open an issue and ask, it’ll also help building the documentation.

## Next steps

Right [now the documentation it’s just a stub](https://serverjs.io/documentation/) with some parts missing or inaccurate. The idea is for the documentation to be in a usable state for the Beta 2 so devs can effectively use it and then polish it all the way to the 1.0.0. Hopefully there will be just 2-3 betas.

It is a long road, but I think I will be able to launch the second beta with usable documentation in 2-4 weeks. For people using it now there’s [a specification file](https://github.com/franciscop/server/blob/master/api.js) to make sure you know what the stable API is.

Finally and to make it truly production-ready many tests and examples must be added. I’ve been adding some, specially with unexpected bugs, but I’ll need to write many more.

## Try it out!

```js
npm install server
```

Then create a hello world in your index.js:

```js
const server = require('server');
server(ctx => {
  return 'Hello world!';
});
```

Open http://localhost:3000/ and you’ll see it working. To know how to use it all see [the official website](https://serverjs.io/).

I would love to know what you think, so please [leave your feedback on the Hacker News thread](https://news.ycombinator.com/item?id=14521776) and [check the code and star it on Github](https://github.com/franciscop/server).

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=d53d01468ac5)

---

[Server.js beta 1 released](https://medium.com/server-for-node-js/server-js-beta-1-released-d53d01468ac5) was originally published in [Server for Node.js](https://medium.com/server-for-node-js) on Medium, where people are continuing the conversation by highlighting and responding to this story.

---

_Originally published on [Medium](https://medium.com/server-for-node-js/server-js-beta-1-released-d53d01468ac5)._
