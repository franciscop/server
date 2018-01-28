const schema = require('./schema');

const platform = process.platform;

describe('schema', () => {
  beforeEach(() => {
    process.platform = 'windows';
  });
  afterEach(() => {
    process.platform = platform;
  });

  it('cleans the public from the relative argument', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: { public: './public' },
      def: { default: '/another' }
    });
    expect(cleaned).toBe(process.cwd() + '/public');
  });

  it('cleans the public from the absolute argument', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: { public: process.cwd() + '/public' },
      def: { default: '/another' }
    });
    expect(cleaned).toBe(process.cwd() + '/public');
  });

  it('cleans the public from the relative default', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: {},
      def: { default: './another' }
    });
    expect(cleaned).toBe(process.cwd() + '/another');
  });

  it('cleans the public from the absolute default', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: {},
      def: { default: process.cwd() + '/another' }
    });
    expect(cleaned).toBe(process.cwd() + '/another');
  });
});
