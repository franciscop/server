// Detect whether the passed parameter is an instance of server or not
module.exports = (potential = {}) => {
  return (potential instanceof Promise) || (potential.close && potential.server && potential.plugins);
};
