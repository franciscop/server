// A setTimeout() with promises
module.exports = time => new Promise(resolve => {
  setTimeout(resolve, time);
});
