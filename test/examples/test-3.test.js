// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const run = require('server/test/run');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 3', () => {
  it('works', async () => {
    // START
    const options = {
      public: 'public'
    };
    
    /* test */
    const same = ctx => ({ public: ctx.options.public });
    const res = await run(options, same).get('/');
    expect(res.body.public).toBe(path.join(process.cwd() + '/public'));
    // END
  });
});
      