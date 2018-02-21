// Detect whether the passed parameter is an instance of server or not
module.exports = async (potential) => {
  if (potential instanceof Promise) {
    potential = await potential;
  }
  return potential.close && potential.server && potential.plugins;
};
