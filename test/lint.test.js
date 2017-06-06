const path = require('path');
const { exec } = require('mz/child_process');

const command = path.resolve(process.cwd() + '/node_modules/.bin/eslint');

const lint = src => new Promise((resolve, reject) => {
  const place = path.resolve(__dirname + '/../' + src);
  // const src = path.resolve(__dirname + '/../server.js');
  exec(`${command} ${place}`, (err, stdout, stderr) => {
    if (stdout.length) return reject(stdout);
    resolve();
  });
});

describe('linter', () => {
  it('lints the src', async () => {
    return await lint('src');
  }, 30000);

  it('lints the plugins', async () => {
    return await lint('plugins');
  }, 30000);
});
