// Test automatically retrieved. Do not edit manually
const { render, json, redirect } = require('server/reply');
const { get, post, put, del, error } = require('server/router');
const { modern } = require('server').utils;
const test = require('server/test');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 5', () => {
  it('works', async () => {
    // START
        const options = {
      public: 'public'
    };
    
    /* test */
    const same = ctx => ({ public: ctx.options.public });
    const res = await test(options, same).get('/');
    expect(res.body.public).toBe(path.join(process.cwd() + '/public'));
    // END
  });
});