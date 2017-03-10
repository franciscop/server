# Modern

This is a function to convert `connect` (and `express`) middleware to *modern* middleware for [`server` (link)](https://serverjs.io/). It takes the old-style middleware and returns one based around promises.

Old style:

```js
var middleware = function(req, res, next){
  // do something
  next();
}
```

New style:

```js
// Sync
const middleware = ctx => {
  // do something
};

// Async
const middleware = ctx => new Promise((resolve, reject) => {
  // do something
  resolve();
});
```
