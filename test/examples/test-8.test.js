// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const test = require('server/test');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 8', () => {
  it('works', async () => {
    // START
        const options = {
      views: './'
    };
    
    /* test */
    const same = ctx => ({ views: ctx.options.views });
    const res = await test(options, same).get('/');
    expect(res.body.views).toBe(process.cwd() + path.sep);
    // END
  });
});