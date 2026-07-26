---
title: Getting a great npm name
description: Note: thanks to npm making this possible and for their awesome support.
date: 2017-06-20
tag: Blog
---

_Note: thanks to npm making this possible and for their awesome support._

You might be surprised to know that I am developing [server.js](https://serverjs.io/) under the npm name “_server_”, so I can direct users to just do npm install server. Wait, wasn’t this package taken already?

In fact it was; there was a 0.0.3 version published a few years back. But npm’s “[Package Name Disputes](https://www.npmjs.com/policies/disputes)” is pretty clear about it:

> “Some things are not allowed, and will be removed without discussion if they are brought to the attention of the npm registry admins, including but not limited to: […] “Squatting” on a package name that you _plan_ to use, but aren’t actually using. […] Putting empty packages in the registry.”

From the lack of use from the author and devs, npm decided to hand it over when the original author didn’t answer my emails. Let’s see how to do it.

## A package has a name

First of all we have to identify a package name that we might want to use. My rule of thumb is to try to find a package that follows most of these:

- **Unstable**: latest version in the low **0.x** or even in the **0.0.x.** This means the package is still marked as “in development” as per [semver guideliness](http://semver.org/) so the work _should_ still not be used in production by anyone.
- **Inactive**: The package has not received any significant update in years, meaning that the authors are probably long gone or don’t care anymore.
- **Not used**: The weekly installations are in the low numbers; they will never be 0 though, since there are many caches and crawlers just installing them (under 10/week is a good number). You don’t want to break packages used by thousands of developers.
- **Trivial**: there hasn’t been a lot of work put into the package. This is more of a respect thing as someone put a lot of work into it.

I find this info with [url hacking](http://jerz.setonhill.edu/writing/e-text/url-hacking-do-it-yourself-navigation/) writing [https://npmjs.com/package/NAME](https://www.npmjs.com/package/package) for precise matching, but [the search functionality](https://www.npmjs.com/search) has been improved greatly in the recent years so you can use that as well.

There was something weird going on in the early npm versions so the name is case-sensitive; you’ll have to check the **lowercase** name as that’s the only supported ones nowadays.

## Get the package

Great! You found an amazing package name that follows most of the points mentioned above. The quoted dispute policy is to _automatically_ remove a package, but we might also want to use a name that is not in direct violation of the conditions. It’s time to wear our peopleware hat.

It’s simple and [well explained](https://www.npmjs.com/policies/disputes): email the person holding the current package. Most people are actually easy to reason with so just ask nicely and give a valid reason (the name is perfect a package you are finishing). CC npm staff so in any way it will be resolved within 1-2 months.

The other person might not have access to that email or not care anymore, in which case npm will intervene and give their verdict about what will happen after few weeks.

## Next steps

You might be asked by npm to publish from the 1.x version to avoid any possible compatibility issue. However you can get around this to not yet launch an official build by using 1.0.0-alpha.1 versions first.

[Let me know](https://twitter.com/fpresencia) if you get a great name or have any question! Also check out [server.js](https://serverjs.io/) to make a full Node.js server easily with npm install server and:

```js
// index.js
```

```js
// Include it and extract some methods for convenience
const server = require('server');
const { get, post } = server.router;

// Launch server with some options and a couple of routes
server({ port: 8080 },
  get('/', () => 'Hello world'),
  post('/', ctx => console.log(ctx.data))
);
```

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=b0b2b27a0e1b)

---

[Getting a great npm name](https://medium.com/server-for-node-js/getting-a-great-npm-name-b0b2b27a0e1b) was originally published in [Server for Node.js](https://medium.com/server-for-node-js) on Medium, where people are continuing the conversation by highlighting and responding to this story.

---

_Originally published on [Medium](https://medium.com/server-for-node-js/getting-a-great-npm-name-b0b2b27a0e1b)._
