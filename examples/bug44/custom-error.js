const CustomError = function (message, status = 500, options = {}) {
  this.message = message;
  this.status = status;
  for (let key in options) {
    this[key] = options[key];
  }
  this.code = 'custom';  // This has special meaning but it is not documented yet; just don't set it to 'server'
};
CustomError.prototype = new Error;

module.exports = CustomError;
