// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const run = require('server/test/run');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 0', () => {
  it('works', async () => {
    // START
    const mid = ctx => {
      expect(ctx.options.port).toBe(3012);
    };
    
    /* test */
    const res = await run({ port: 3012 }, mid, () => 200).get('/');
    expect(res.status).toBe(200);
    // END
  });
});
      