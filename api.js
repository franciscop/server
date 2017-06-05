// API Specification
// This document is to define server's stable API
// - Main function
// - options
// - middleware
// - context
// - router
// - reply
// - utils



// Main function
const server = require('server');

// Definition: an ASYNC function that accepts options and/or middleware
server(opts, mid1, mid2, ...).then(...);

// Properties (defined below)
server.router;
server.reply;
server.utils;



// Options
const ops = {

  // Simple options
  port,
  engine,
  public,
  secret,
  log,

  // TODO: MISSING MANY HERE; THIS PART IS NOT YET STABLE

  // Plugins options
  core,
  parser,
};



// Middleware
// Definition: (a)sync function, accepts the Context and returns a reply
const mid1 = ctx => { ... };
const mid2 = async ctx => { ... };

// Return types
// String => HTML or PLAIN response
const mid = ctx => 'Hello world';
// Array/Object => JSON response
const mid = ctx => ['I', 'am', 'json'];
const mid = ctx => ({ hello: 'world' });  // To return an object the extra () is needed
// Reply instance
const mid = ctx => server.reply.send('hello world');



// Context
// Definition: all of the currently known data. Varies depending on location
// NOTE: there are more properties, but they are not considered stable
ctx.options,  // the specified or inherited options
ctx.log,      // a method to log things in several levels
ctx.reply,    // same as above
ctx.utils,    // utilities
ctx.server,   // the currently running server instance

// For middleware/routers
ctx.data,     // the parsed body if it's a POST request
ctx.params,   // NOTE: NOT YET, rely on ctx.req.params so far
ctx.query,    // NOTE: NOT YET, rely on ctx.req.query so far
// ...

// Non-stable (will change at some point in the future)
ctx.req,      // express request; considering removing/changing it in 1.1
ctx.res,      // express response; not useful anymore, use server.reply instead



// Router
const router = server.router;
const router = require('server/router');

// Definition: handle the different methods and paths requested
router.get('/', mid1);
router.post('/users', mid2);
router.put('/users/:id', mid3);

// Methods (REST methods not explained):
router.get;
router.post;
router.put;
router.del;
router.socket;  // Handle websocket calls
router.error;   // Handle errors further up in the chain



// Reply
const reply = server.reply;
const reply = require('server/reply');

// Definition: handle the response from your code
// Note: it MUST be returned from the middleware or it won't be executed
reply.cookie;
reply.download;
reply.end;
reply.file;
reply.header;
reply.json;
reply.jsonp;
reply.redirect;
reply.render;
reply.send;
reply.status;
reply.type;



// Utils
const utils = server.utils;
const utils = require('server/utils');  // NOT YET AVAILABLE

// Definition: some extra utilities to make development easier
utils.modern;  // Make express middleware work with server.js
