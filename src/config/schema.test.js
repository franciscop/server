const schema = require('./schema');
const path = require('path');

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
    expect(cleaned).toBe(process.cwd() + path.sep + 'public');
  });

  it('cleans the public from the absolute argument', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: { public: process.cwd() + path.sep + 'public' },
      def: { default: '/another' }
    });
    expect(cleaned).toBe(process.cwd() + path.sep + 'public');
  });

  it('cleans the public from the relative default', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: {},
      def: { default: './another' }
    });
    expect(cleaned).toBe(process.cwd() + path.sep + 'another');
  });

  it('cleans the public from the absolute default', () => {
    const clean = schema.public.clean;
    const cleaned = clean('C:\\Users\\Public', {
      arg: {},
      def: { default: process.cwd() + path.sep + 'another' }
    });
    expect(cleaned).toBe(process.cwd() + path.sep + 'another');
  });
});
