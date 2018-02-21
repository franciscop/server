
// Make an object with the options as expected by request()
module.exports = (method, url, port, options) => {

  // Make sure it's a simple object
  if (typeof options === 'string') options = { url: options };

  // Assign independent parts
  options = Object.assign({}, options, { url, method });

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
