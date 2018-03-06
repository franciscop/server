// First parameter can be:
// - path: String
// - options: Number || Object (cannot be ID'd)
// - middleware: undefined || null || Boolean || Function || Array
module.exports = middle => (typeof middle[0] === 'string') ? ({
  path: middle.shift(), opts: {}, middle
}) : (
  typeof middle[0] === 'undefined' ||
  typeof middle[0] === 'boolean' ||
  middle[0] === null ||
  middle[0] instanceof Function ||
  middle[0] instanceof Array
) ? ({
    path: '*', opts: {}, middle
  }) : ({
    path: '*', opts: middle.shift(), middle
  });
