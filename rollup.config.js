// rollup.config.js
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import builtinlist from 'builtin-modules';

export default {
  input: 'packages/list.js',
  output: {
    file: 'packages/index.js',
    format: 'cjs',
    name: 'packages'
  },
  external: builtinlist,
  plugins: [
    json(),
    babel({
      plugins: ['transform-class-properties'],
      include: ['node_modules/**'],
    }),
    resolve({
      jsnext: true,
      main: true,
      preferBuiltins: false
    }),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: [ "./packages/index.js", "./node_modules/**" ], // Default: undefined

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false, // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false, // Default: true
    }),
    // globals(),
    builtins(),
  ]
};
