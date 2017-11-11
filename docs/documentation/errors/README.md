# Errors

<blockquote class="error">
  If you happen to stumble here, this bit of the documentation is outdated and follows some old code. Please help us improve the project and the docs so we can make it into the official release.
</blockquote>

There are many type of errors that can occur with server.js and here we try to explain them and how to fix them. They are divided by category: where/why they are originated.

We also overview here how to handle errors. You have to [first define it](#define-an-error), then [throw the error](#throw-the-error) and finally [handle the error](#error-handling).


### Define an error

To define an error in your code the best way to do it is to use the package `human-error` (by the author of server), since it's made to combine perfectly with server.js. In the future we might integrate it, but so far they are kept separated.

To define an error, create a different file that will contain all or part of your errors, here called `errors.js` for our site `mycat.com`:

```js
// errors.js
const errors = require('human-error')();  // <-- notice this

errors['/mycat/nogithubsecret'] = `
  There is no github secret set up. Make sure you have saved it in your '.env',
  and if you don't have access go see Tom and he'll explain what to do next.
  https://mycat.com/guide/setup/#github
`;

module.exports = errors;
```

### Throw the error

Now let's use it, to do so we'll just need to import this file and throw the corresponding error:

```js
const server = require('server');
const HumanError = require('./errors');

server(ctx => {
  if (!ctx.options.githubsecret) {
    throw new HumanError('/mycat/nogithubsecret');
  }
});
```

Try it! Run the code with `node .` and try accessing [http://localhost:3000/](http://localhost:3000). You should see a `server error` on the front-end and the proper description in the back-end.



### Error handling

Now this was an error for the developers where we want to be explicit and show the error clearly. For users thought things change a bit and are greatly improved by server's error handling.

First let's deal with super type checking:

```js
const route = get('/post/:id', ctx => {
  if (!/^\d+$/.test(ctx.params.id)) {
    throw new HumanError('/mycat/type/invalid', { base: '/post' });
  }
});

// Handle a wrong id error and redirect to a 404
const handle = error('/mycat/type/invalid', async ctx => {
  return redirect(`/${ctx.error.base || ''}?message=notfound`);
});

// Handle all type errors in the namespace "mycat"
const handleType = error('/mycat/type', () => {
  return redirect(`/${ctx.error.base || ''}?message=notfound`);
});

// Handle all kind of unhandled errors in the namespace "mycat"
const handleAll = error('/mycat', () => {
  return status(500);
});
```


Let's say that someone is trying to access something they don't have access to. Like deleting a comment that is not theirs:

```js
// comments.js
module.exports = [
  ...
  del('/comment/:id', async ctx => {
    const comment = await db.comment.findOne({ _id: ctx.params.id });
    if (!comment.author.equals(ctx.user._id)) {
      throw new HumanError('/mycat/auth/unauthorized', { user: ctx.user._id });
    }
  })
];
```

Later on you can handle this specific error, we could log these specific kind of errors, etc.




## Native

### /server/native/portused

This happens when you try to launch `server` in a port that is already being used by another process. It can be another server process or a totally independent process. To fix it you can do:

- Check that there are no other terminals running this process already.
- Change the port for the server such as `server({ port: 5000 });`.
- Find out what process is already using the port and stop it. In Linux: `fuser -k -n tcp 3000`.

Example on when this error is happening:

```js
const server = require('server');
// DO NOT DO THIS:
server(3000);
server(3000);
```

To fix it, invoke it with a different port:

```js
const server = require('server');
server(2000);
server(3000);
```



## Options

These errors are related to server's options.

### /server/options/portnotanumber




## Core

These errors occur when handling a specific part of server.js.

### /server/core/missingmiddleware

This will normally happen if you are trying to create a `server` middleware from an `express` middleware but forget to actually pass express' middleware.

This error happens when you call `modern()` with an empty or falsy value:

```js
const { modern } = server.utils;
const middle = modern();  // Error
```



### /server/core/invalidmiddleware

This happens when you try to call `modern()` with an argument that is not an old-style middleware. The first and only argument for `modern()` is a function with `express`' middleware signature.

This error should also tell you dynamically which type of argument you passed.

```js
const { modern } = server.utils;
const middle = modern('hello');
```
