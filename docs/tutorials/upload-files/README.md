# Upload files

On the old days (for the web) you had your own server with permanent storage, so any file that you wrote into your filesystem would persist there. However nowadays you make a change, deploy the server and nuke the whole thing out of orbit, making webhosting ephemeral.

This is an issue when saving our user-uploaded images, and several solutions have came up over the years to fix it. I've used Cloudinary in the past since it has a very generous free tier, so I'm going to show here how to set it up. Finally I'll share some alternatives.


## Create account

Head over [to Cloudinary website](https://cloudinary.com/) and create a new account with "Sign up for Free":


You can skip the setup without any problem. Your account is ready to go! Let's integrate it into server.js.



## Installation

After [getting started](https://serverjs.io/tutorials/getting-started/) we install both server.js and [cloudinary sdk](https://github.com/cloudinary/cloudinary_npm):

```js
npm install server cloudinary
```

Here is the full documentation for [Cloudinary for Node.js](https://cloudinary.com/documentation/node_integration), though we will be using the bare basics in this tutorial.

Then we have to make sure that we are [handling our secrets](https://serverjs.io/documentation/options/#environment) correctly. Since [you are probably using sessions](https://serverjs.io/tutorials/sessions-production/), in our file `.env` we will add:

```bash
# .env
# ...

# Note: write your actual key and secret
CLOUDINARY_KEY=██████████████
CLOUDINARY_SECRET=████████████████████████████
```

That's it, now let's see how to use our new account



## Uploading user files

Now that we have everything set-up, let's say we want to upload **every** picture that gets uploaded to our site automatically. We can do it with a small middleware that we will create:

```js
const server = require('server');
const { get, post } = server.router;
const { render, redirect } = server.reply;

// First configure Cloudinary:
const cloudinary = require('cloudinary').config({
  cloud_name: 'sample',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Create a middleware to upload any file attached in `ctx.files`
const uploadAll = async ctx => {
  if (!ctx.files || !Object.keys(ctx.files).length) return;

  for (const key in ctx.files) {
    const res = await cloudinary.uploader.upload(ctx.files[key]);
    ctx.files[key] = res.secure_url;
  }
};

server(
  uploadAll,
  get('/', () => render('index.hbs')),
  post('/', () => {
    console.log(ctx.files);
    redirect('/');
  })
);
```
