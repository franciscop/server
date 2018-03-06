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
  it('lints the error', async () => {
    return await lint('error');
  }, 100000);

  it('lints the plugins', async () => {
    return await lint('plugins');
  }, 100000);

  it('lints the reply', async () => {
    return await lint('reply');
  }, 100000);

  it('lints the router', async () => {
    return await lint('router');
  }, 100000);

  it('lints the src', async () => {
    return await lint('src');
  }, 100000);

  it('lints the utils', async () => {
    return await lint('utils');
  }, 100000);
});
