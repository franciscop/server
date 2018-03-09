
// Make an object with the options as expected by `request()` library
module.exports = (method = 'GET', url = '/', port = 3000, options) => {

  // Make sure it's a simple object
  if (typeof options === 'string') {
    options = options.replace(/\/$/, '');
    url = url.replace(/^\//, '');
    options = { url: options + '/' + url };
  }

  // Assign independent parts
  options = Object.assign({}, { headers: {} }, { url, method }, options);

  if (options && options.body && typeof options.body === 'string') {
    options.headers['Content-Type'] = 'text/plain';
  }

  // Make sure it has a right URL or localhost otherwise
  if (!/^https?:\/\//.test(options.url)) {
    options.url = `http://localhost:${port}${options.url}`;
  }

  // Set it to send a JSON when appropriate
  if (options.body && typeof options.body === 'object') {
    options.json = true;
  }

  // Finally return the fully formed object
  return options;
};
