# Options

Available options, their defaults, types and names in `.env`:

|name                   |default            |[.env](#environment)      |type  |
|-----------------------|-------------------|--------------------------|------|
|[`port`](#port)        |`3000`             |`PORT=3000`               |Number|
|[`secret`](#secret)    |`'secret-XXXX'`    |`SECRET=secret-XXXX`      |String|
|[`public`](#public)    |`'public'`         |`PUBLIC=public`           |String|
|[`views`](#views)      |`'views'`          |`VIEWS=views`             |String|
|[`engine`](#engine)    |`'pug'`            |`ENGINE=pug`              |String|
|[`env`](#env)          |`'development'`    |**`NODE_ENV=development`**|String|
|[`favicon`](#favicon)  |`false`            |`FAVICON=public/logo.png` |String|
|[`parse`](#parse)      |[[info]](#parse)   |[[info]](#parse)          |Object|
|[`session`](#session)  |[[info]](#session) |[[info]](#session)        |Object|
|[`security`](#security)|[[info]](#security)|[[info]](#security)       |Object|
|[`log`](#log)          |`'info'`           |`LOG=info`                |String|

You can set those through **the first argument** in `server()` function:

```js
// Import the main library
const server = require('server');

// Launch the server with the options
server({
  port: 3000,
  public: 'public',
});
```

The options preference order is this, from more important to less:

1. `.env`: the variable [within the environment](#environment).
2. `server({ OPTION: 3000 })`: the variable [set as a parameter](#parameter) when launching the server.
3. *defaults*: defaults will be used as can be seen below

They are accessible for your dev needs through `ctx.options` ([read more in context options](/documentation/context/#options)):

```js
server(ctx => console.log(ctx.options));
// { port: 3000, public: './public', ... }
```



### Environment

Environment variables are *not commited in your version control* but instead they are provided by the machine or Node.js process. In this way these options can be different in your machine and in testing, production or other type of servers.

They are uppercase and they can be set through a file called literally `.env` in your root folder:

```
PORT=3000
PUBLIC=public
SECRET=secret-XXXX
ENGINE=pug
NODE_ENV=development
```

> Remember to **add `.env` to your `.gitignore`**.

To set them in remote server it will depend on the hosting that you use ([see Heroku example](https://devcenter.heroku.com/articles/config-vars)).



### Argument

The alternative to the environment variables is to pass them **as the first argument** when calling `server()`. Each option is a combination of key/value in the object and they all go in lowercase. See some options with their defaults:

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


### Special cases

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





## Port

The port where you want to launch the server. Defaults to `process.env.PORT` or `3000` if not found, and it's the only option that can be specified as a single option:

```js
server();        // Use the default port 3000
server(3000);    // Specify the port
server({ port: 3000 });  // The same as the previous one
```

If you are setting the port in your environment that will take preference over the argument [as all environment variables](#environment). So it will work seamlessly in Heroku and other hosts that define a `PORT` environment variable.

Or you can leave it empty and just use your `.env` file:

```
PORT=3000
```

Example: setting the port to some other number. For numbers 1-1024 you'd need administrator permission, so we're testing it with higher ports:

```js
const options = {
  port: 5001
};

/* test */
const same = ctx => ({ port: ctx.options.port });
const res = await run(options, same).get('/');
expect(res.body.port).toBe(5001);
```



## Secret

It is [**highly recommended**](https://serverjs.io/tutorials/sessions-production/) that you set this in your environment variable for both development and production before you start coding. It should be a random and long string. It can be used by middleware for storing secrets and keeping cookies/sessions:

```
SECRET=your-random-string-here
```

The *default* provided will be different each time the server is launched. This is not suitable for production, since you want persistent sessions even with server restarts. See the [session in production tutorial](https://serverjs.io/tutorials/sessions-production/) to set it up properly (includes some extras such as Redis sessions).

It **cannot** be set as a variable: <strike>`server({ secret: 'whatever' });`</strike>.

If you have other secrets it is recommended that you prepend those by their respective vendor names:

```js
# Used by server.js for sessions
SECRET=your-random-string-here

# Used by different middleware
GITHUB_SECRET=your-github-secret
CLOUDINARY_SECRET=your-cloudinary-secret
# ...
```



## Public

|name     |default  |[.env](#environment) |type   |notes       |
|---------|---------|---------------------|-------|------------|
|`public` |`public` |`PUBLIC=public`      |String |Folder path |

The folder where your **static assets** are. This includes images, styles, javascript for the browser, etc. Any file that you want directly accessible through the browser such as `example.com/myfile.pdf` should be in this folder. You can set it to any folder within your project.

To set the public folder in the environment add this to [your `.env`](#environment):

```
PUBLIC=public
```

Through the initialization parameter:

```js
const options = {
  public: 'public'
};

/* test */
const same = ctx => ({ public: ctx.options.public });
const res = await run(options, same).get('/');
expect(res.body.public).toBe(path.join(process.cwd() + '/public'));
```

To set the root folder specify it as `'./'`:

```js
const options = {
  public: './'
};

/* test */
const same = ctx => ({ public: ctx.options.public });
const res = await run(options, same).get('/');
expect(res.body.public).toBe(process.cwd() + path.sep);
```

If you don't want any of your files to be accessible publicly, then you can cancel it through a false or empty value:

```js
server({ public: false });
server({ public: '' });
```



## Views

|name     |default  |[.env](#environment) |type   |notes       |
|---------|---------|---------------------|-------|------------|
|`views`  |`views`  |`VIEWS=views`        |String |Folder path |

The folder where you put your view files and templates. These are the files used by the [`render()` method](/documentation/reply/#render-). You can set it to any folder within your project.

To set the views folder in the environment add this to [your `.env`](#environment):

```
VIEWS=views
```

Or pass it as another option:

```js
const options = {
  views: 'views'
};

/* test */
const same = ctx => ({ views: ctx.options.views });
const res = await run(options, same).get('/');
expect(res.body.views).toBe(path.join(process.cwd(), 'views') + path.sep);
```

To set the root folder specify it as `'./'`:

```js
const options = {
  views: './'
};

/* test */
const same = ctx => ({ views: ctx.options.views });
const res = await run(options, same).get('/');
expect(res.body.views).toBe(process.cwd() + path.sep);
```

If you don't have any view file you don't have to create the folder. The files within `views` should all have an extension such as `.hbs`, `.pug`, etc. To see how to install and use those keep reading.



## Engine

|name     |default  |[.env](#environment) |type           |notes       |
|---------|---------|---------------------|---------------|------------|
|`engine` |`engine` |`ENGINE=engine`      |String, Object |[engine](https://github.com/expressjs/express/wiki#template-engines)  |

> Note: this option, as all options, can be ignored and server.js will work with both `.pug` and `.hbs` (Handlebars) file types.

The view engine that you want to use to render your templates. [See all the available engines](https://github.com/expressjs/express/wiki#template-engines). To use an engine you normally have to install it first except for the pre-installed ones [pug](https://pugjs.org/) and [handlebars](http://handlebarsjs.com/):

```
npm install [ejs|nunjucks|emblem] --save
```

Then to use that engine you just have to add the extension to the [`render()` method](/documentation/reply/#render-):

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

### Writing your own engine

Engines are really easy to write with server.js. They must be a function that receives the file path and the options (or locals) and returns the text to render from the engine. It can be either sync or async. To configure it for handling a specific extension, just put that as the key in an object for `engine`.

As an example of how to handle nunjucks, in a single file for it:

```js
// nunjucks-engine.js
const nunjucks = require('nunjucks');

// The .render() in Nunjucks is sync, so no need to wait
module.exports = (file, options) => nunjucks.render(file, options);
```

Then in your main file:

```js
const server = require('server');
const { get } = server.router;
const { render } = server.reply;
const nunjucks = require('./nunjucks');

const options = {
  engine: {
    // Register two keys for the same render function
    nunjucks,
    njk: nunjucks
  }
};

server(options, [
  get('/', () => render('index.njk', { a: 'b' })),
  get('/hello', () => render('hello.nunjucks'))
]);
```

You can also set the function to `async` and it will wait until it is resolved, and return the result to the browser as expected.



## Env

|name  |default       |[.env](#environment)       |type           |notes                |
|------|--------------|---------------------------|---------------|---------------------|
|`env` |`development` |**`NODE_ENV=development`** |String, Object |['development', 'test', 'production']  |

Define the context in which the server is running. It **has to be** one of those: `'development'`, `'test'` and `'production'`. Some functionality might vary depending on the environment, such as live/hot reloading, cache, etc. so it is recommended that you set these appropriately.

> Note: The environment variable is called **NODE_ENV** while the option as a parameter is **env**.

This variable does not make sense as a parameter to the main function, so we'll normally use this within our `.env` file. See it here with the *default `development`*:

```
NODE_ENV=development
```

Then in your hosting environment you'd set it to production (some hosts like Heroku do so automatically):

```
NODE_ENV=production
```

These are the only accepted types for NODE_ENV:

```js
development
test
production
```

You can check those within your code like:

```js
server(ctx => {
  console.log(ctx.options.env);
});
```



## Favicon

To include a favicon, specify its path with the `favicon` key:

```js
const server = require('server');

server({ favicon: 'public/favicon.png' },
  ctx => 'Hello world'
);
```

The path can be absolute or relative to the root of your project.

Most browsers require `/favicon.ico` automatically, so you might be seeing 404 errors if the favicon is not returned for this situation.



## Parse

The parsing middleware is included by default. It uses few of them under the hood and these are the options for all of them. They should all work by default, but still give access to the options if you want to make some more advanced modifications.

### Body parser

This is the name for the default parser for `<form>` without anything else. The technical name and for those coming from express is `urlencoded`. See the [available options in the middleware documentation](https://github.com/expressjs/body-parser#bodyparserurlencodedoptions).

As an example, let's say that you want to upgrade from the default `limit` of `100kb` to `1mb`:

```js
server({
  parser: {
    body: { limit: '1mb' }
  }
});
```

### JSON parser

This will parse JSON requests into the actual variables. See the [available options in this middleware documentation](https://github.com/expressjs/body-parser#bodyparserjsonoptions).

As an example, let's say (as above) that we want to change the limit for requests from `100kb` to `1mb`. To do so, change the json parser option:

```js
server({
  parser: {
    json: { limit: '1mb' }
  }
});
```

You can also combine the two above:

```js
server({
  parser: {
    body: { limit: '1mb' },
    json: { limit: '1mb' }
  }
});
```

### Text parser

Plain ol' text. As with the other examples, refer to the [middleware full documentation](https://github.com/expressjs/body-parser#bodyparsertextoptions) for more comprehensive docs.

An example, setting the size limit for the requests:

```js
server({
  parser: {
    text: { limit: '1mb' }
  }
});
```

### Data parser

This is for file uploads of any type. It uses Formidable underneath, so refer to [the Formidable documentation](https://github.com/felixge/node-formidable#api) for the full list of options.

An example:

```js
server({
  parser: {
    data: { uploadDir: '/my/dir' }
  }
});
```

### Cookie parser

For using cookies, it uses cookie-parser underneath so [refer to express documentation](https://expressjs.com/en/api.html#res.cookie) for the full list of options.

An example:

```js
server({
  parser: {
    cookie: {
      maxAge: 900000,
      httpOnly: true
    }
  }
});
```




## Session

It accepts these options as an object:

```js
server({ session: {
  resave: false,
  saveUninitialized: true,
  cookie: {},
  secret: 'INHERITED',
  store: undefined,
  redis: undefined
}});
```

You can [read more about these options in Express' package documentation](https://github.com/expressjs/session).

All of them are optional. Secret will inherit the secret from the global secret if it is not explicitly set.

If the session.redis option or the env `REDIS_URL` is set with a Redis URL, a Redis store will be launched to achieve persistence in your sessions. Read more about this in [the tutorial **Sessions in production**](http://serverjs.io/tutorials/sessions-production/). Example:

```bash
# .env
REDIS_URL=redis://:password@hostname:port/db_number
```

```js
// index.js
const server = require('server');

// It will work by default since it's an env variable
server({}, ...);
```

Otherwise, to pass it manually (**not recommended**) pass it through the options:

```js
const redis = 'redis://:password@hostname:port/db_number';
server({ session: { redis } }, ...);
```


### Session Stores

To use one of the many available third party session stores, pass it as the `store` parameter:

```js
// Create your whole store thing
const store = ...;

// Use it within the session
server({ session: { store } }, ...);
```

Many of the stores will need you to pass the raw **`session`** initially like this:

```js
const RedisStore = require('connect-redis')(session);
const store = RedisStore({ ... });
```

You can access this variable through `server.session` after requiring `server`:

```js
const server = require('server');
const RedisStore = require('connect-redis')(server.session);
const store = RedisStore({ ... });

server({ session: { store } }, ...);
```



## Security

It combines [Csurf](https://github.com/expressjs/csurf) and [Helmet](https://github.com/helmetjs/helmet) to give extra security:

```js
server({
  security: {
    csrf: {
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
      value: req => req.body.csnowflakerf
    },
    frameguard: {
      action: 'deny'
    }
  }
});
```

We are using [Helmet](https://helmetjs.github.io/) for great security defaults. To pass any [helmet option](https://github.com/helmetjs/helmet), just pass it as another option in security:

```js
server({
  security: {
    frameguard: {
      action: 'deny'
    }
  }
});
```

For quick tests/prototypes, the whole security plugin can be disabled (**not recommended**):

```js
server({ security: false });
```

Individual parts can also be disabled like this. This makes sense if you use other mechanisms to avoid CSRF, such as JWT:

```js
server({
  security: {
    csrf: false
  }
});
```

Their names in the `.env` are those:

```
SECURITY_CSRF
SECURITY_CONTENTSECURITYPOLICY
SECURITY_EXPECTCT
SECURITY_DNSPREFETCHCONTROL
SECURITY_FRAMEGUARD
SECURITY_HIDEPOWEREDBY
SECURITY_HPKP
SECURITY_HSTS
SECURITY_IENOOPEN
SECURITY_NOCACHE
SECURITY_NOSNIFF
SECURITY_REFERRERPOLICY
SECURITY_XSSFILTER
```



## Log

Display some data that might be of value for the developers. This includes from just some information up to really important bugs and errors notifications.

You can set [several log levels](https://www.npmjs.com/package/log#log-levels) and it **defaults to 'info'**:

- `emergency`: system is unusable
- `alert`: action must be taken immediately
- `critical`: the system is in critical condition
- `error`: error condition
- `warning`: warning condition
- `notice`: a normal but significant condition
- `info`: a purely informational message
- `debug`: messages to debug an application

Do it either in [your `.env`](#environment):

```
LOG=info
```

Or as a parameter to the main function:

```js
server({ log: 'info' });
```

To use it do it like this:

```js
server(ctx => {
  ctx.log.info('Simple info message');
  ctx.log.error('Shown on the console');
});
```

If we want to modify the level and only show the warnings or more important logs:

```js
server({ log: 'warning' }, ctx => {
  ctx.log.info('Not shown anymore');
  ctx.log.error('Shown on the console');
});
```





### Advanced logging

You can also pass a `report` variable, in which case the level should be specify as `level`:

```js
server({
  log: {
    level: 'info',
    report: (content, type) => {
      console.log(content);
    }
  }
});
```

This allows you for instance to handle some specific errors in a different way. It is also useful for testing that the correct data is printed on the console in certain situations.
