# TO-DO list

<a class="button" href="https://github.com/franciscop/server-tutorial-spreadsheet">Source code</a>

In this tutorial you will learn to design a basic API to create a list of items. We will store those in a MongoDB database using Mongoose and it will be for a single person.

Some possible uses:

- An actual TO-DO list. Some times you just need a simple list.
- The beginning of Hacker News, Reddit, or similar. Those are basically four glorified CRUDs: users, stories, comments, votes.



## Install dependencies

After [getting your project ready](/tutorials/getting-started) you'll have to make sure that you have MongoDB installed following [the official guide](https://docs.mongodb.com/manual/administration/install-community/) and run it (will depend on your installation process). For Ubuntu you can simply do:

```bash
mongod --version   # Should display a number
mongod
```

Then we install the two libraries that we will be using **within our project folder**:

```bash
npm install server mongoose
```



## REST API

Let's first of all define our API. Let's keep it simple! Within index.js we write:

```js
const server = require('server');
const { get, post, put, del } = server.router;

server([
  get('/', /*TODO*/),
  post('/', /*TODO*/),
  put('/:id', /*TODO*/),
  del('/:id', /*TODO*/)
]);
```



## Database

We are using Mongosse (a layer on top of MongoDB) to implement



## Functionality

Now let's implement each of the parts. We will do it first in the same file, then (as it might happen in real life) we will split that code into a separate file to keep things clean and concerns separated.

First the get; we won't be doing a strict REST API since the GET will be rendering the HTML, but quite similar:

```js
get('/', ctx => {

})
```
