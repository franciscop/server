let expect = require('chai').expect;
let pray = require('pray');

// Load the loadware
let loadware = require('./loadware/test');

let server = require('../server');

describe('Options', () => {
  it('can be initialized empty', done => {
    server().then((...args) => console.log(args));
  });

  it('can be initialized wth a port', done => {
    server((Math.random * 10000) % 1000).then(app => done()).catch(err => done(err));
  });
});
