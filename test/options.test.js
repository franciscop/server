const options = require('./options');

describe('test/options', () => {
  it('works with defaults', () => {
    expect(options()).toEqual({});
  });

  it('overwrites correctly', () => {
    expect(options({ a: 1 }, { a: 2 })).toEqual({ a: 1 });
  });
});
