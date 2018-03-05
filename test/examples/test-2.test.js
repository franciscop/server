// Test automatically retrieved. Do not edit manually
const { render, json, redirect } = require('server/reply');
const { get, post, put, del, error } = require('server/router');
const { modern } = require('server').utils;
const test = require('server/test');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 2', () => {
  it('works', async () => {
    // START
        const middle = ctx => {
      expect(ctx.data).toBe('Hello 世界');
    };
    
    /* test */
    // Security set to false for testing purposes
    const opts = { body: 'Hello 世界' };
    const res = await test({ security: false }, middle, () => 200).post('/', opts);
    expect(res.status).toBe(200);
    // END
  });
});