// Import the generic REST handler
const generic = require('./generic');

// Defined the actual method
module.exports = (...middle) => {
  return generic('DELETE', ...middle);
};
