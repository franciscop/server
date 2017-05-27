// Parse the request parameters
module.exports = middle => {
  const path = typeof middle[0] === 'string' ? middle.shift() : '*';
  return { path, middle };
};
