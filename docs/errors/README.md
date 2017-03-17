# Errors

A list of all the possible errors that can happen within `server`, their explanation and extra info.

## PortAlreadyUsed

This happens when you try to launch `server` in a port that is already being used by another process. It can be another server process or a totally independent process. To fix it you can do:

- Change the port for the server such as `server({ port: 5000 });`
- Find out what process is already using the port and stop it.



## MissingMiddleware

This will normally happen if you are trying to create a `server` middleware from an `express` middleware but forget to actually pass express' middleware.

This error happens when you call `modern()` with an empty or falsy value:

```js
const { modern } = server.utils;
const middle = modern();  // Error
```



## InvalidMiddleware

This happens when you try to call `modern()` with an argument that is not an old-style middleware. The first and only argument for `modern()` is a function with `express`' middleware signature.

This error should also tell you dynamically which type of argument you passed.

```js
const { modern } = server.utils;
const middle = modern('hello');
```
