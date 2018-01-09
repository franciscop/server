// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const run = require('server/test/run');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 2', () => {
  it('works', async () => {
    // START
    const options = {
      port: 5001
    };
    
    /* test */
    const same = ctx => ({ port: ctx.options.port });
    const res = await run(options, same).get('/');
    expect(res.body.port).toBe(5001);
    // END
  });
});
      