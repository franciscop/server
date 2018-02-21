// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const test = require('server/test');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 1', () => {
  it('works', async () => {
    // START
    const middle = ctx => {
      expect(ctx.options.port).toBe(7693);
    };
    
    /* test */
    const res = await test({ port: 7693 }, middle, () => 200).get('/');
    expect(res.status).toBe(200);
    // END
  });
});
      