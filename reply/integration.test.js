const server = require('server');
const { send, json } = require('.');
const run = require('server/test/run');

describe('reply integration', () => {

  it('simple send answer', async () => {
    const mid = () => send('Hello 世界');
    const res = await run(mid).get('/');
    expect(res.body).toBe('Hello 世界');
  });

  it('answers json', async () => {
    const mid = () => json([0, 1, 'a']);
    const res = await run(mid).get('/');
    expect(res.rawBody).toBe('[0,1,"a"]');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
