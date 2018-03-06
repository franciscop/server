const env = require('./env');

describe('Parses the .env correctly', () => {
  it('works with pseudo-json', () => {
    expect(env.TEST44).toBe('{"a"}');
  });
});
