const request = require('supertest');

// The promise exported from your index
const serverPromise = require('./index.js');

// This will be populated after the server has launched. You can call it
// anything you want; server, runtime, ctx, instance, etc. are all valid names
let server;

describe('user', () => {
  beforeAll(async () => {
    server = await serverPromise;
  });
  afterAll(async () => {
    await server.close();
  });
  it('tests the user endpoint', async () => {
    await request(server.app)
      .get('/user')
      .expect('Content-Type', /json/)
      .expect('Content-Length', '15')
      .expect(200);
  });
});
