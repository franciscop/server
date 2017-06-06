# Options

These are the available options, their defaults, types and how to specify them in `.env`:

|name                |default         |[.env](#environment)         |main type |
|--------------------|----------------|-----------------------------|----------|
|[`port`](#port)     |`3000`          |`PORT=3000`                  |Number    |
|[`secret`](#secret) |`'secret-XXXX'` |`SECRET=secret-XXXX`         |String    |
|[`public`](#public) |`'public'`      |`PUBLIC=public`              |String    |
|[`engine`](#engine) |`'pug'`         |`ENGINE=pug`                 |String    |
|[`views`](#views)\* |`'views'`       |`VIEWS=views`                |String    |
|[`env`](#env)\*     |`'development'` |**`NODE_ENV=development`**   |String    |
|[`ssl`](#ssl)\*     |`false`         |`???`                        |Object    |
|[`log`](#log)\*     |`all`           |`LOG=all`                    |String    |

\*not yet documented ([help us editing this?](https://github.com/franciscop/server/tree/master/docs/documentation/options))


The options preference order is this, from more important to less:

1. `.env`: the variable [within the environment](#environment).
2. `server({ OPTION: 3000 })`: the variable [set as a parameter](#parameter) when launching the server.
3. *defaults*: defaults will be used as can be seen below

They are accessible for your dev needs through `ctx.options` ([read more in Middleware](../middleware)):

```js
server(ctx => console.log(ctx.options));
// { port: 3000, public: './public', ... }
```



## Environment

Environment variables are *not commited in your version control* but instead they are provided by the machine or Node.js process. In this way these options can be different in your machine and in testing, production or other type of servers.

They are uppercase and they can be set through a file called `.env` in your computer:

```
PORT=3000
PUBLIC=public
SECRET=secret-XXXX
ENGINE=pug
NODE_ENV=development
```

> Remember to **add `.env` to your `.gitignore`**.

To set them in remote server it will depend on the hosting that you use ([see Heroku example](https://devcenter.heroku.com/articles/config-vars)).



## Parameter

The alternative to the environment variables is to pass them **as the first parameter** when calling `server()`. Each option is a combination of key/value in the object and they all go in lowercase. See some options with their defaults:

```js
const server = require('server');

server({
  port: 3000,
  public: 'public',
  secret: 'secret-XXXX',
  engine: 'pug',
  env: 'development'   // Remember this is "env" and not "node_env" here
});
```


## Special cases

As a general rule, an option that is an object becomes a `_` separated string in uppercase for the `.env` file. For example, for the SSL we have to pass an object such as:

```js
server({
  port: 3000,
  ssl: {
    key: './ssl.pem',
    cert: './ssl.cert'
  }
});
```

So if we want to put this in the environment variable we'd set it up such as:

```
PORT=3000
SSL_KEY=test/fixtures/keys/agent2-key.pem
SSL_CERT=test/fixtures/keys/agent2-cert.cert
```

The converse is not true; a `_` separated string in the `.env` does not necessarily become an object as a parameter. You'll have to read the documentation of each option and plugin for the specific details.



## Available options

Description of all the available options, their defaults and how to use them.

### Port

The port where you want to launch the server. Defaults to `3000` and it's the only option that can be specified as a single option:

```js
server();        // Use the default port 3000
server(3000);    // Specify the port
server({ port: 3000 });  // The same as the previous one
```

Some hosts such as Heroku will define an environment variable called `PORT`, so it will work smoothly there. You can also set it instead in your `.env` if you prefer it:

```
PORT=3000
```



### Secret

It is [**highly recommended**](https://github.com/franciscop/server/issues/3) that you set this in your environment variable for both development and production before you start coding. It should be a random and long string. It will be used by several middleware for storing secrets and keeping cookies/sessions:

```
SECRET=your-random-string-here
```

> Note: the *default* provided is weak as it will be different each time the server is launched.



### Public

The folder where your static assets are. This includes images, styles, javascript for the browser, etc. Any file that you want directly accessible through `example.com/myfile.pdf` should be in this folder. You can set it to any folder within your project.

To set the public folder in the environment add this to [your `.env`](#environment):

```
PUBLIC=./public
```

Through the initialization parameter:

```js
server({ public: './public' });
```

To set the root folder specify it as `'./'`:

```js
server({ public: './' });
```

If you don't want any of your files to be accessible publicly, then you can cancel it through a false or empty value:

```js
server({ public: false });
server({ public: '' });
```



### Engine

The view engine that you want to use to render your templates. [See all the available engines](https://github.com/expressjs/express/wiki#template-engines). To use an engine you normally have to install it first except for the pre-installed [pug](https://pugjs.org/) and handlebars:

```
npm install [ejs|nunjucks|emblem] --save
```

To use that engine you just have to add the extension to the `render()` method:

```js
// No need to specify the engine if you are using the extension
server(ctx => render('index.pug'));
server(ctx => render('index.hbs'));
// ...
```

However if you want to use it without extension, you can do so by specifying the engine in `.env`:

```
ENGINE=pug
```

Or through the corresponding option in javascript:

```js
server({ engine: 'pug' }, ctx => render('index'));
```
