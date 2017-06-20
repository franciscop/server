const fs = require('fs');
const path = require('path');

module.exports = walk = function(dir, done) {
  done = done || (() => {});
  let results = [];
  let list = fs.readdirSync(dir);

  var pending = list.length;
  if (!pending) return done(null, results);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file, function(err, res) {
        results = results.concat(res);
        if (!--pending) done(null, results);
      });
    } else {
      results.push(file);
      if (!--pending) done(null, results);
    }
  });
  return results;
};
