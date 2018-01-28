// Auto-load client plugins
// This will go through the root `package.json` and load all of the server.js
// specific plugins. Those are the ones that start by `@server/`. If there is no
// one to be found, do nothing

// Get the root directory for the currently running process
const dir = require('pkg-dir').sync();

let client = [];
try {
  const pack = require(dir + require('path').sep + 'package.json');
  const isPlugin = name => /^@server\//.test(name);
  client = Object.keys(pack.dependencies).filter(isPlugin).map(require);
} catch (err) {
  console.log('Error trying to read your "package.json", please report it in github:', err);
}

// Export all of the plugins, both internally and autoloaded
module.exports = [
  require('./log'),
  require('./express'),
  require('./parser'),
  require('./static'),
  require('./socket'),
  require('./session'),
  require('./security'),
  require('./favicon'),
  require('./compress'),
  require('./final'),
  ...client
];
