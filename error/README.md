# Experimental syntax proposal

```js
// Using a factory
const ErrorFactory = require('server/error');
const ServerError = ErrorFactory('/server/', {});

const ErrorFactory = require('server/error');
class ServerError extends ErrorFactory {
  namespace: '/server',
  url: ({ id }) => ...,
  status: 500
}

// Using the plain import method
const ServerError = require('server/error')('/server/');
const ServerError = require('server/error')('/server/', {
  namespace: '/server/',
  url: ({ slug }) => `https://serverjs.io/documentation/errors/#${slug}`,
  status: 500,
});
const ServerError = require('server/error')({
  namespace: '/server/'
});

const SassError = require('server/error')({
  namespace: '/plugin/sass',
  url: ({ slug }) => `https://serverjs.io/documentation/errors/#${slug}`,
});

const ServerError = require('server/error');

const SassError = ServerError(null, {
  namespace: '/plugin/sass',
  status: 500
});

const SassError = ServerError.defaults({
  namespace: '/plugin/sass/',
  status: 500
});

SassError.exists = ({ file }) => `
The file "${file}" already exists. Please rename it or remove it so @sass/server
can work properly. <3
`;

throw new SassError('exists');
throw new SassError('exists', { status: 500 });
throw new SassError('exists', { file: FILENAME });
```
