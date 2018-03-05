// Test automatically retrieved. Do not edit manually
const { render, json, redirect } = require('server/reply');
const { get, post, put, del, error } = require('server/router');
const { modern } = require('server').utils;
const test = require('server/test');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 0', () => {
  it('works', async () => {
    // START
        const mid = ctx => {
      expect(ctx.options.port).toBe(3012);
    };
    
    /* test */
    const res = await test({ port: 3012 }, mid, () => 200).get('/');
    expect(res.status).toBe(200);
    // END
  });
});