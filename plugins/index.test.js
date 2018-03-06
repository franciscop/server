/* eslint-env  */

// No 'package.json' inside ./test
// eslint-disable-next-line no-undef
jest.mock('pkg-dir', () => ({ sync: () => process.cwd() + '/test' }));

describe('loading from package.json', () => {

  it('throws if it cannot find package.json', async () => {
    expect(() => require('./index')).toThrow(/Error trying to read/);
  });

  afterAll(() => {
    // eslint-disable-next-line no-undef
    jest.resetAllMocks();
    // eslint-disable-next-line no-undef
    jest.resetModules();
  });
});
