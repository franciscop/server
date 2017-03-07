## Options

The first argument of the main function is for setting the options. It can be nothing, a single integer or a plain object:

```js
server();
server(3000);
server({ port: 3000 });  // the same
```

As you can guess, internally if it is a single integer it will be converted to the object `{ port: ARG }`. This is a handy shortcut in case you want the default options except for the port, otherwise you can specify the options (defaults shown here):

```js
server({
  port: 3000,
  public: './public',
  viewengine: 'pug',

  middle: {
    // Default middleware options here, see below
  }
});
```

**Environment variables**: `server` will value the environment variables higher than the ones you pass explicitly in the function. These can be set through the initial script or by creating a file called `.env`. They should be uppercase and with a underscore instead of a space:

```
PORT=3000
VIEW_ENGINE=pug
```

> Don't forget then to add `.env` to your `.gitignore`.

These are similar to:

```js
server({
  port: 3000,
  'view engine': 'pug'
});
```

So this is the inclusion order, from more important to less:

1. `.env`: the variable within the environment.
2. `server({ OPTION: 3000 })`: the variable set manually when launching the server.
3. *defaults*: defaults will be used as can be seen below


### `port` : `3000`

The port where you want to launch the server. Defaults to `3000` and it's the only option that can be specified as a single option:

```js
server(3000);
server({ port: 3000 }); // the same
```

To set the port in the environment, create a file called `.env` with this:

```
PORT=3000
```



### `public` : `./public`

The folder where your static assets are. This includes images, styles, javascript for the browser, etc. Any file that you want directly accessible through `example.com/myfile.pdf` should be in this folder. You can set it to any folder within your project.

Through the initialization option:

```js
server({
  public: './public'
});
```


To set the public folder in the environment, create a file called `.env` with this:

```
PUBLIC=./public
```



### `view engine` : `pug`

The view engine that you want to use to render your templates. [Read more about pug](https://pugjs.org/).

Through the initialization option:

```js
server({
  'view engine': 'pug'
});
```


To set the template engine in the environment, create a file called `.env` with this:

```
VIEW_ENGINE=./public
```


### `secret` : `undefined`

This will be inherited by several middleware if they are not set explicitly for the modules. Use a random string here, but it cannot be auto-generated as it has to be the same between restarts from the server. It is also recommended that you **set this up inside *.env*.** and not as a parameter hardcoded into the code:

```js
// NO (in app.js):
server({ secret: 'your-random-string-here' });
```

Yes (in `.env`):

```
SECRET=your-random-string-here
```
