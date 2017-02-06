// Execute a command on the Terminal with a promise
module.exports = (cmd, args) => new Promise((resolve, reject) => {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";
  child.stdout.on('data', buffer => resp += buffer.toString());
  child.stdout.on('end', () => resolve(resp));
  child.on('error', reject);
});
