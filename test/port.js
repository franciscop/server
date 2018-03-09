// Port - generate a random valid port number that has not been used yet

// Get an unused port in the user range (2000 - 10000)
const ports = [];
const limit = 1000;

const random = () => 1024 + parseInt(Math.random() * 48151);

// Keep a count of how many times we tried to find a port to avoid infinite loop
const randPort = (i = 0) => {
  const port = module.exports.picker();

  if (i > 100) {
    throw new Error('All ports seem to be used for testing! If you have under 10.000 tests please report this :(');
  }

  // If "i" is already taken try again
  if (ports.includes(port)) {
    return randPort(i + 1);
  }

  // Add it to the list of ports already being used and return it
  ports.push(port);
  return port;
}

module.exports = randPort;
module.exports.picker = random;
