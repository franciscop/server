# Options

These are the available options, their defaults, types and how to specify them in `.env`:

|name                |default         |[.env](#environment) |type           |
|--------------------|----------------|---------------------|---------------|
|[`port`](#port)     |`3000`          |`PORT=3000`          |Number         |
|[`secret`](#secret) |`'secret-XXXX'` |`SECRET=secret-XXXX` |String         |
|[`public`](#public) |`'public'`      |`PUBLIC=public`      |String         |
|[`engine`](#engine) |`'pug'`         |`ENGINE=pug`         |String, Object |
|[`env`](#env)       |`'development'` |**`NODE_ENV=pug`**   |String         |


The options preference order is this, from more important to less:

1. `.env`: the variable within the environment.
2. `server({ OPTION: 3000 })`: the variable set manually when launching the server.
3. *defaults*: defaults will be used as can be seen below

They are accessible for your dev needs through `ctx.options` ([read more in Middleware](../middleware)):

```js
server(ctx => console.log(ctx.options));
// { port: 3000, public: './public', ... }
```



### Environment

Environment variables are *not commited in your version control* but instead they are provided by the machine or Node.js process. In this way these options can be different in your machine and in the remote server(s).

They are uppercase and can be set through a file called `.env` ([or other ways](https://medium.com/@rafaelvidaurre/managing-environment-variables-in-node-js-2cb45a55195f)):

```
PORT=3000
PUBLIC=public
SECRET=secret-XXXX
ENGINE=pug
NODE_ENV=development
```

> Do not forget then to add `.env` to your `.gitignore`





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

It is **highly recommended** that you set this in your environment variable for both development and production before you start coding. It should be a random and long string. It will be used by several middleware for storing secrets and keeping cookies/sessions:

```
SECRET=your-random-string-here
```

> Note: the *default* provided is weak as it will be different each time the server is launched.



### Public

The folder where your static assets are. This includes images, styles, javascript for the browser, etc. Any file that you want directly accessible through `example.com/myfile.pdf` should be in this folder. You can set it to any folder within your project.

Through the initialization option:

```js
server({ public: './public' });
```


To set the public folder in the environment, create a file called `.env` with this:

```
PUBLIC=./public
```



### Engine

The view engine that you want to use to render your templates. [Read more about pug](https://pugjs.org/).

Even if you are using a custom render engine, you might not need to set this if you are using the extension for the render() method:

```js
// No need to specify the engine if you are using the extension
server(ctx => ctx.res.render('index.pug'));
```


However if you want to use it without extension, you can do so by specifying the engine:

```js
server({ engine: 'pug' }, ctx => ctx.res.render('index'));
```

Finally, you can add your own engines in this way:

```js

```
