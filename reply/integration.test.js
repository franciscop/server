const server = require('server');
const { send, json } = require('.');
const { getter } = require('server/test');

describe('reply integration', () => {

  it('simple send answer', async () => {
    const res = await getter(() => send('Hello 世界'));
    expect(res.body).toBe('Hello 世界');
  });

  it('answers json', async () => {
    const res = await getter(() => json([0,1,'a']));
    expect(res.body).toBe('[0,1,"a"]');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});
