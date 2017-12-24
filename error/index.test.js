const ErrorFactory = require('./index.js');

describe('server/error', () => {
  it('is a function', () => {
    expect(ErrorFactory instanceof Function).toBe(true);
  });

  it('canNOT do simple errors', () => {
    expect(new ErrorFactory('Hello world').message).not.toBe('Hello world');
    expect(new ErrorFactory('Hello world') instanceof Error).not.toBe(true);
  });

  it('does not create a plain error', () => {
    expect(ErrorFactory().message).toBe(undefined);
    expect(ErrorFactory() instanceof Function).toBe(true);
    expect(ErrorFactory('Hello world').message).toBe(undefined);
    expect(ErrorFactory('Hello world') instanceof Function).toBe(true);
    expect(ErrorFactory('Hello world', {}).message).toBe(undefined);
    expect(ErrorFactory('Hello world', {}) instanceof Function).toBe(true);
  });

  it('can create errors from within the factory', () => {
    expect(ErrorFactory('/server/')('test') instanceof Error).toBe(true);
    expect(ErrorFactory('/server/')('test').code).toBe('/server/test');
    expect(ErrorFactory('/server/')('test', { status: 500 }).status).toBe(500);
  });

  it('can create errors from within the factory', () => {
    expect(ErrorFactory('/server/')('test') instanceof Error).toBe(true);
    expect(ErrorFactory('/server/')('test').code).toBe('/server/test');
    expect(ErrorFactory('/server/')('test').namespace).toBe('/server/');
    expect(ErrorFactory('/server/')('test', { status: 500 }).status).toBe(500);
  });

  describe('Namespaces', () => {
    const TestError = ErrorFactory('/server/', { status: 500 });

    it('has the correct defaults', () => {
      expect(TestError().status).toBe(500);
      expect(TestError().code).toBe('/server');
      expect(TestError().id).toBe('server');
    });

    it('can extend the errors', () => {
      const err = TestError('demo', { status: 501 });
      expect(err.status).toBe(501);
      expect(err.code).toBe('/server/demo');
      expect(err.id).toBe('server-demo');
    });

    it('is the same as with the instance', () => {
      const err = TestError('demo', { status: 501 });
      const err2 = new TestError('demo', { status: 501 });
      expect(err).toMatchObject(err2);
    });
  });

  describe('Define errors', () => {
    const TestError = ErrorFactory('/server/', { status: 500 });
    TestError.aaa = 'First error';

    it('has the correct message', () => {
      expect(TestError('aaa').message).toBe('First error');
    });

    it('can define an error with a function', () => {
      TestError.bbb = () => `Function error`;
      expect(TestError('bbb').message).toBe('Function error');
    });

    it('defines errors globally', () => {
      expect(TestError('bbb').message).toBe('Function error');
    });

    it('errors are namespaced', () => {
      const TestError = ErrorFactory('/server/');
      expect(TestError('bbb').message).toBe(undefined);
    });

    it('gets the options in the interpolation', () => {
      TestError.ccc = ({ status }) => `Function error ${status}`;
      expect(TestError('ccc', { status: 505 }).message).toBe('Function error 505');
    });
  });
});
