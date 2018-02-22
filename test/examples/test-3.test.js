// Test automatically retrieved. Do not edit manually
const { render, json } = require('server/reply');
const { get, post } = require('server/router');
const { modern } = require('server').utils;
const test = require('server/test');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 3', () => {
  it('works', async () => {
    // START
        const middle = get('/:type/:id', ctx => {
      expect(ctx.params.type).toBe('dog');
      expect(ctx.params.id).toBe('42');
    });
    
    /* test */
    const res = await test(middle, () => 200).get('/dog/42');
    expect(res.status).toBe(200);
    // END
  });
});