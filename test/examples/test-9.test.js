// Test automatically retrieved. Do not edit manually
const { render, json, redirect } = require('server/reply');
const { get, post, put, del, error } = require('server/router');
const { modern } = require('server').utils;
const test = require('server/test');
const fs = require('mz/fs');
const path = require('path');

describe('Automatic test from content 9', () => {
  it('works', async () => {
    // START
        // Require the user to be authenticated
    const isAuth = ctx => ctx.user ? null : new Error('No user :(');
    
    // Handle any kind of error that wasn't handled
    const handler = error(ctx => redirect('/'));
    
    // The protected route
    const protectedRoute = get('/hello', isAuth, ctx => 'Protected', handler);
    
    /* test */
    const home = get('/', ctx => 'Good!');
    const res = await test(home, protectedRoute).get('/hello');
    expect(res.body).toBe('Good!');
    // END
  });
});