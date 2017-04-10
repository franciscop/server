// Port - generate a random valid port number that has not been used yet

// Get an unused port in the user range (2000 - 10000)
const ports = [];
const limit = 1000;

const random = () => 2000 + parseInt(Math.random() * 8000);

// Keep a count of how many times we tried to find a port to avoid infinite loop
const randPort = (i = 0) => {

  // Too many ports tried and none was available
  if (i >= limit) {
    throw new Error('Tried to find a port but none seems available');
  }

  const port = random();

  // If "i" is already taken try again
  if (port in ports) {
    return randPort(i + 1);
  }

  // Add it to the list of ports already being used and return it
  ports.push(port);
  return port;
}

module.exports = randPort;
