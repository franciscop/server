# Real-time chat

In this tutorial you will learn how websockets work, the specifics of socket.io and how to create a real-time chat with server.js.

Make sure to [follow the getting started tutorial](/tutorials/getting-started/) first. We won't use any database, so there is no chat history, just real time chat.

> Note: the socket.io plugin is experimental right now so please don't use this in production (or at least lock the version down).


## Websockets in server

[Websockets](https://en.wikipedia.org/wiki/WebSocket) are a web technology for real time, bidirectional communication from the browser to the server and back. This has traditionally been a hard problem, with the browser [having to poke every X seconds](https://stackoverflow.com/a/28197906/938236) to the server to ask for new data.

The most commonly used library is [socket.io](https://socket.io/) since it makes it a lot easier to use the underlying technology. This library is included by default from `server`, so let's take advantage of it!

First let's do a simple server that will render a HTML page:

```js
const server = require('server');
const { get, socket } = server.router;
const { render } = server.reply;

server([
  get('/', ctx => render('index.html'))
]);
```

Now we will add `connect` and `disconnect` routes. We want to update everyone with the current amount of users when a someone joins or leaves. We can use the same function for both of them that will send a message to everyone with [socket.io's `io.emit()`](https://socket.io/docs/emit-cheatsheet/):

```js
const server = require('server');
const { get, socket } = server.router;
const { render } = server.reply;

const updateCounter = ctx => {
  ctx.io.emit('count', ctx.io.sockets.sockets.length);
};

server([
  // For the initial load render the index.html
  get('/', ctx => render('index.html')),

  // Join/leave the room
  socket('connect', updateCounter),
  socket('disconnect', updateCounter)
]);
```

Finally let's create a new socket router that, when it receives a message, it will push the same message to everyone in a similar way as before:

```js
const server = require('server');
const { get, socket } = server.router;
const { render } = server.reply;

// Update everyone with the current user count
const updateCounter = ctx => {
  ctx.io.emit('count', ctx.io.sockets.sockets.length);
};

// Send the new message to everyone
const sendMessage = ctx => {
  ctx.io.emit('message', ctx.data);
};

server([
  get('/', ctx => render('index.html')),
  socket('connect', updateCounter),
  socket('disconnect', updateCounter),
  socket('message', sendMessage)
]);
```

Great, now we have our back-end. Launch it by running this in your terminal:

```bash
node .
```

## User interface

Now if you try to browse to `localhost:3000` it should **not work** since `index.html` does not exist. We are going to create a user interface that looks something like this:

![Tokyo Chat](/tutorials/chat/img/mockup.png)

First create a file called `index.html` inside a folder called `views`:

```html
<!-- /views/index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>First website</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>

    Hello world

    <!-- Include jquery, cookies, socket.io (client-side) and your own code -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
    <script src="https://unpkg.com/cookiesjs@1/cookies.min.js"></script>
    <script src="https://unpkg.com/socket.io-client@2/dist/socket.io.slim.js"></script>
    <script src="/javascript.js"></script>
  </body>
</html>
```

This is the basic HTML skeleton of your chat. If you save everything, restart node.js and go to [localhost:3000](http://localhost:3000) you should see "Hello World".

> Beginner tip: the HTML code below should be in the place of "Hello world" above

Now let's make the actual interface. We will wrap everything with a `<main>` tag for the general layout, then put the different elements:

```html
<main>
  <header>
    <div class="user-count">0</div>
    <h1>Tokyo Chat</h1>
  </header>

  <section class="chat"></section>

  <form>
    <input type="text" placeholder="Say something nice" />
    <button>Send</button>
  </form>
</main>
```

Since the main focus of this tutorial is **not** to teach HTML+CSS, let's just copy/paste the CSS into `./public/style.css` and get it done with:

```css
/* /public/style.css */
* {
  box-sizing: border-box;
  transition: all .3s ease;
}

html, body {
  background: #eee;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

main {
  width: calc(100% - 20px);
  max-width: 500px;
  margin: 0 auto;
  font-family: Helvetica, Arial, Sans, sans-serif;
}

h1,
.user-count {
  margin: 0;
  padding: 10px 0;
  font-size: 32px;
}

.user-count {
  float: right;
}

.chat {
  content: '';
  width: 100%;
  height: calc(100vh - 165px);
  background: white;
  padding: 5px 10px;
}

.chat p {
  margin: 0 0 10px 0;
}

form {
  margin: 10px 0;
}

input, button {
  font: inherit;
  background: #fff;
  border: none;
  padding: 5px 10px;
}

input {
  width: 100%;
}

button {
  margin-top: 10px;
  width: 100%;
  cursor: pointer;
}

button:hover {
  background: #ddd;
}

@media all and (min-width: 500px) {
  .chat {
    height: calc(100vh - 120px);
  }
  input {
    width: calc(100% - 160px);
  }
  button {
    margin-top: 0;
    float: right;
    width: 150px;
  }
}
```

You can see a quick example of this interface [in this JSFiddle](https://jsfiddle.net/franciscop/u9wepopc/).




## Choose a username

However, before anything happens, let's add the username in a file called `javascript.js` inside the folder `public`:

```js
// /public/javascript.js

// Get the current username from the cookies
var user = cookies('user');
if (!user) {

  // Ask for the username if there is none set already
  user = prompt('Choose a username:');
  if (!user) alert('We cannot work with you like that!');

  // Store it in the cookies for future use
  cookies({ user: user });
}
```

Great, now if we load our website we should see a prompt that looks like this:

!IMAGE OF PROMPT
