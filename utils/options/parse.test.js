const parse = require('./parse');
const path = require('path');


describe('parsing', () => {
  describe('parses the options correctly', () => {
    const schema = { hello: { default: 'default' } };

    it('uses the default', async () => {
      const parsed = await parse(schema);
      expect(parsed).toEqual({ hello: 'default' });
    });

    it('uses the env', async () => {
      const parsed = await parse(schema, { hello: 'env' });
      expect(parsed).toEqual({ hello: 'env' });

      const parsed2 = await parse(schema, { HELLO: 'env' });
      expect(parsed2).toEqual({ hello: 'env' });
    });

    it('uses the arg', async () => {
      const parsed = await parse(schema, {}, { hello: 'arg' });
      expect(parsed).toEqual({ hello: 'arg' });

      const parsed2 = await parse(schema, {}, { HELLO: 'arg' });
      expect(parsed2).toEqual({ hello: 'arg' });
    });

    it('uses the parent', async () => {
      const parsed = await parse(schema, {}, {}, { hello: 'parent' });
      expect(parsed).toEqual({ hello: 'parent' });

      const parsed2 = await parse(schema, {}, {}, { HELLO: 'parent' });
      expect(parsed2).toEqual({ hello: 'parent' });
    });
  });

  describe('parses the order correctly', () => {
    const schema = { hello: { default: 'world' } };
    const arg = { hello: 'argument' };
    const env = { HELLO: 'env' };
    const parent = { hello: 'parent' };

    it('uses the env before the arg', async () => {
      const parsed = await parse(schema, env, arg, parent);
      expect(parsed.hello).toBe('env');
    });

    it('uses the env before the parent', async () => {
      const parsed = await parse(schema, env, {}, parent);
      expect(parsed.hello).toBe('env');
    });

    it('uses the arg before the parent', async () => {
      const parsed = await parse(schema, {}, arg, parent);
      expect(parsed.hello).toBe('argument');
    });
  });



  describe('cancel option parsing', () => {
    it('pass "false" to stop parsing options for this', async () => {
      const parsed = await parse({}, false);
      expect(parsed).toBe(false);

      const parsed2 = await parse({}, {}, false);
      expect(parsed2).toBe(false);
    });
  });



  describe('__root', () => {
    const schema = {
      __root: 'hello',
      hello: { default: 'default' }
    };

    it('still uses the default', async () => {
      const parsed = await parse(schema);
      expect(parsed.hello).toBe('default');
    });

    it('uses the root correctly', async () => {
      const parsed = await parse(schema, 'arg');
      expect(parsed.hello).toBe('arg');
    });

    it('rejects when `__root` was unexpected', async () => {
      const env = parse({}, {}, 'hello');
      await expect(env).rejects.toHaveProperty('code', '/server/options/notobject');
    });

    it('rejects when `__root` is not a string', async () => {
      const env = parse({ __root: {} }, {}, 'hello');
      await expect(env).rejects.toHaveProperty('code', '/server/options/rootnotstring');
    });
  });



  describe('schema must be valid', () => {
    it('does not work with string schema', async () => {
      const parsed = parse({ hello: 'world' });
      await expect(parsed).rejects.toHaveProperty('code', '/server/options/noobjectdef');
    });

    it('does not work with number schema', async () => {
      const parsed = parse({ hello: 25 });
      await expect(parsed).rejects.toHaveProperty('code', '/server/options/noobjectdef');
    });

    it('does not work with function schema', async () => {
      const parsed = parse({ hello: () => {} });
      await expect(parsed).rejects.toHaveProperty('code', '/server/options/noobjectdef');
    });
  });



  describe('can use find to manually find the value', () => {
    it('uses the find function', async () => {
      const parsed = await parse({ hello: { find: () => 'world' } });
      expect(parsed).toEqual({ hello: 'world' });
    });

    it('has the right arguments in find', async () => {
      const parsed = await parse({ hello: { find: ({ env, arg, parent, schema}) => {
        expect(typeof env).toBe('object');
        expect(typeof arg).toBe('object');
        expect(typeof parent).toBe('object');
        expect(typeof schema).toBe('object');
        return 'good!';
      } } });
      expect(parsed).toEqual({ hello: 'good!' });
    });
  });



  describe('correct parts are chosen', () => {
    const schema = {
      hello: {
        arg: 'arghello',
        env: 'envhello',
        inherit: 'parhello'
      },
      world: {
        arg: true,
        env: true,
        inherit: true
      },
      foo: {
        arg: false,
        env: false,
        inherit: false
      }
    };

    it('can change the name of the env', async () => {
      const parsed = await parse(schema, { hello: 'bad', envhello: 'good' });
      expect(parsed).toEqual({ hello: 'good' });
    });

    it('uses the default name of the env', async () => {
      const parsed = await parse(schema, { world: 'good' });
      expect(parsed).toEqual({ world: 'good' });
    });

    it('no `env` should be given no env', async () => {
      const env = parse(schema, { NODE_ENV: 'test', foo: 'bar' });
      await expect(env).rejects.toHaveProperty('code', '/server/options/noenv');
    });

    it('can change the name of the argument', async () => {
      const parsed = await parse(schema, {}, { hello: 'bad', arghello: 'good' });
      expect(parsed).toEqual({ hello: 'good' });
    });

    it('uses the default name of the argument', async () => {
      const parsed = await parse(schema, {}, { world: 'good' });
      expect(parsed).toEqual({ world: 'good' });
    });

    it('no `arg` should be given no arg', async () => {
      const arg = parse(schema, { NODE_ENV: 'test' }, { foo: 'abc' });
      await expect(arg).rejects.toHaveProperty('code', '/server/options/noarg');
    });

    it('can change the name of the parent', async () => {
      const parsed = await parse(schema, {}, {}, { hello: 'bad', parhello: 'good' });
      expect(parsed).toEqual({ hello: 'good' });
    });

    it('uses the default name of the parent', async () => {
      const parsed = await parse(schema, {}, {}, { world: 'good' });
      expect(parsed).toEqual({ world: 'good' });
    });
  });



  describe('extends a base object', () => {
    const schema = {
      hello: {
        default: { a: 'b' },
        extend: true
      }
    };

    it('uses the default with nothing else', async () => {
      const parsed = await parse(schema);
      expect(parsed).toEqual({ hello: { a: 'b' } });
    });

    it('can extend without default', async () => {
      const parsed = await parse({ hello: { extend: true } }, {}, { hello: { a: 'b' } });
      expect(parsed).toEqual({ hello: { a: 'b' } });
    });

    it('can extend with nothing', async () => {
      const parsed = await parse(schema, {}, { hello: undefined });
      expect(parsed).toEqual({ hello: { a: 'b' } });

      const parsed2 = await parse(schema, {}, { hello: {} });
      expect(parsed2).toEqual({ hello: { a: 'b' } });
    });

    it('can add properties to the end', async () => {
      const parsed = await parse(schema, {}, { hello: { c: 'd' } });
      expect(parsed).toEqual({ hello: { a: 'b', c: 'd' }});
    });
  });



  describe('handles files and folders properly', () => {
    const schema = {
      views: { folder: true, default: 'default' },
      favicon: { file: true, default: 'default.jpg' }
    };

    it('makes it full path', async () => {
      const parsed = await parse(schema);
      expect(parsed.views).toBe(process.cwd() + path.sep + 'default' + path.sep);

      const parsed2 = await parse(schema, { views: 'env' });
      expect(parsed2.views).toBe(process.cwd() + path.sep + 'env' + path.sep);

      const parsed3 = await parse(schema, {}, { views: 'arg' });
      expect(parsed3.views).toBe(process.cwd() + path.sep + 'arg' + path.sep);
    });

    it('makes it full file', async () => {
      const parsed = await parse(schema);
      expect(parsed.favicon).toBe(process.cwd() + path.sep + 'default.jpg');

      const parsed2 = await parse(schema, { favicon: 'env.jpg' });
      expect(parsed2.favicon).toBe(process.cwd() + path.sep + 'env.jpg');

      const parsed3 = await parse(schema, {}, { favicon: 'arg.jpg' });
      expect(parsed3.favicon).toBe(process.cwd() + path.sep + 'arg.jpg');
    });

    it('keeps it full path', async () => {
      const parsed = await parse({
        views: { folder: true, default: process.cwd() + path.sep + 'default' + path.sep }
      });
      expect(parsed.views).toBe(process.cwd() + path.sep + 'default' + path.sep);

      const parsed2 = await parse(schema, { views: process.cwd() + path.sep + 'env' + path.sep });
      expect(parsed2.views).toBe(process.cwd() + path.sep + 'env' + path.sep);

      const parsed3 = await parse(schema, {}, { views: process.cwd() + path.sep + 'arg' + path.sep });
      expect(parsed3.views).toBe(process.cwd() + path.sep + 'arg' + path.sep);
    });

    it('keeps it full file', async () => {
      const parsed = await parse({
        favicon: { file: true, default: process.cwd() + path.sep + 'default.jpg' }
      });
      expect(parsed.favicon).toBe(process.cwd() + path.sep + 'default.jpg');

      const parsed2 = await parse(schema, { favicon: process.cwd() + path.sep + 'env.jpg' });
      expect(parsed2.favicon).toBe(process.cwd() + path.sep + 'env.jpg');

      const parsed3 = await parse(schema, {}, { favicon: process.cwd() + path.sep + 'arg.jpg' });
      expect(parsed3.favicon).toBe(process.cwd() + path.sep + 'arg.jpg');
    });
  });

  describe('clean', () => {
    it('adds a default extension', async () => {
      const parsed = await parse({
        favicon: {
          file: true,
          default: process.cwd() + path.sep + 'default',
          clean: value => value + '.jpg'
        }
      });
      expect(parsed.favicon).toBe(process.cwd() + path.sep + 'default.jpg');
    });
  });



  describe('options inside options', () => {
    const schema = {
      github: {
        options: {
          id: {
            default: 5,
            env: 'GITHUB_ID'
          }
        }
      }
    };

    it('will handle the defaults', async () => {
      const github = await parse(schema);
      expect(github).toEqual({ github: { id: 5 } });
    });

    it('accepts deep env', async () => {
      const github = await parse(schema, { github_id: 20 });
      expect(github).toEqual({ github: { id: 20 } });

      const github2 = await parse(schema, { GITHUB_ID: 20 });
      expect(github2).toEqual({ github: { id: 20 } });
    });

    it('accepts deep options', async () => {
      const github = await parse(schema, {}, { github: { id: 10 }});
      expect(github).toEqual({ github: { id: 10 } });

      const github2 = await parse(schema, {}, { GITHUB: { id: 10 }});
      expect(github2).toEqual({ github: { id: 10 } });

      const github3 = await parse(schema, {}, { github: { ID: 10 }});
      expect(github3).toEqual({ github: { id: 10 } });

      const github4 = await parse(schema, {}, { GITHUB: { ID: 10 }});
      expect(github4).toEqual({ github: { id: 10 } });
    });
  });



  describe('inception', () => {
    const deep = {
      hello: {
        options: {
          world: {
            options: {
              id: {
                default: 10
              }
            }
          }
        }
      }
    };

    it('can have 3 levels deep!', async () => {
      const depth = await parse(deep);
      expect(depth).toEqual({ hello: { world: { id: 10 } }});
    });
  });
});






describe('validation', () => {

  describe('required', () => {
    it('throws with no value for required', async () => {
      const env = parse({ public: { required: true } });
      await expect(env).rejects.toHaveProperty('code', '/server/options/required');
    });
  });

  describe('validate', () => {
    it('does a validation', async () => {
      const validate = () => {
        let err = new Error('Hello world');
        err.code = '/server/options/fakeerror';
        return err;
      };
      const env = parse({ public: { validate } }, { PUBLIC: 'hello' });
      await expect(env).rejects.toHaveProperty('code', '/server/options/fakeerror');
    });

    it('expects the validation to return truthy', async () => {
      const opts = await parse({ public: { validate: () => true } }, {}, { public: 'hello' });
      expect(opts.public).toBe('hello');
    });

    it('expects the validation not to return false', async () => {
      const env = parse({ public: { validate: () => false } });
      await expect(env).rejects.toHaveProperty('code', '/server/options/validate');
    });
  });

  describe('enumeration', () => {
    const schema = {
      hello: {
        default: 'def',
        enum: ['def', 'env', 'arg', 'parent']
      },
      world: {
        enum: ['def', 'env', 'arg', 'parent']
      }
    };

    it('ignores an empty option if not required', async () => {
      const parsed = await parse(schema);
      expect(parsed).toEqual({ hello: 'def' });
    });

    it('uses the arguments correctly', async () => {
      const parsed1 = await parse(schema);
      expect(parsed1).toEqual({ hello: 'def' });

      const parsed2 = await parse(schema, { hello: 'env' }, { hello: 'arg' });
      expect(parsed2).toEqual({ hello: 'env' });

      const parsed3 = await parse(schema, {}, { hello: 'arg' });
      expect(parsed3).toEqual({ hello: 'arg' });
    });

    it('throws when outside of the expected values', async () => {
      const parsedbad = parse(schema, { hello: 'blabla' });
      await expect(parsedbad).rejects.toHaveProperty('code', '/server/options/enum');
    });
  });

  describe('types', () => {
    const schema = {
      hello: { type: [String] },
      world: { type: ['string'] },
      foo: { type: String },
      bar: { type: 'string' }
    };

    it('accepts it within the range', async () => {
      const parsed = await parse(schema, { hello: 'blabla' });
      expect(parsed).toEqual({ hello: 'blabla' });

      const parsed2 = await parse(schema, { world: 'blabla' });
      expect(parsed2).toEqual({ world: 'blabla' });

      const parsed3 = await parse(schema, { foo: 'blabla' });
      expect(parsed3).toEqual({ foo: 'blabla' });

      const parsed4 = await parse(schema, { bar: 'blabla' });
      expect(parsed4).toEqual({ bar: 'blabla' });
    });

    it('rejects it outside the range', async () => {
      const parsed = parse(schema, { hello: 25 });
      await expect(parsed).rejects.toHaveProperty('code', '/server/options/type');

      const parsed2 = parse(schema, { world: 25 });
      await expect(parsed2).rejects.toHaveProperty('code', '/server/options/type');

      const parsed3 = parse(schema, { foo: 25 });
      await expect(parsed3).rejects.toHaveProperty('code', '/server/options/type');

      const parsed4 = parse(schema, { bar: 25 });
      await expect(parsed4).rejects.toHaveProperty('code', '/server/options/type');
    });
  });
});
