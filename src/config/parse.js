const OptionsError = require('./errors');

// For options that default to true
// const trueorundef = value => typeof value === 'undefined' || value === true;

// Primitives to test
// const types = ['Boolean', 'Number', 'String', 'Array', 'Object'];

module.exports = function(schema, arg = {}, env= {}) {
  const options = {};

  if (typeof arg !== 'object') {
    if (!schema.__root) {
      throw new OptionsError('/server/options/notobject');
    }
    arg = { [schema.__root]: arg };
  }

  // Loop each of the defined variables
  for (let key in schema) {

    // RETRIEVAL
    // Make the definition local so it's easier to handle
    const def = schema[key];

    // Skip the control variables such as '__root'
    if (/^\_\_/.test(key)) continue;

    // Use the arguments and environment by default
    if (def.arg === false) {
      if (arg[key]) throw new OptionsError('/server/options/noarg', { key });
    } else {
      def.arg = def.arg === true ? key : def.arg || key;
    }
    if (def.env === false) {
      if (env[key]) throw new OptionsError('/server/options/noenv', { key });
    } else {
      def.env = (def.env === true ? key : def.env || key).toUpperCase();
    }

    // List of possibilities, from HIGHER preference to LOWER preference
    const possible = [env[def.env], arg[def.arg], def.default];
    const value = possible.filter(value => typeof value !== 'undefined').shift();



    // VALIDATION
    // Validate that it is set
    if (def.required) {
      if (typeof value === 'undefined') {
        throw new OptionsError('/server/options/required', { key });
      }
    }

    if (def.enum) {
      if (!def.enum.includes(value)) {
        throw new OptionsError('/server/options/enum', { key, value, possible: def.enum });
      }
    }

    // Validate the type
    if (def.type) {

      // When specifying a String, Number, etc with the constructor
      def.type = (def.type instanceof Array ? def.type : [def.type])
        .map(one => one.name ? one.name : one)
        .map(one => one.toLowerCase());

      // Make sure it is one of the valid types
      if (!def.type.includes(typeof value)) {
        throw new OptionsError('/server/options/type', {
          key,
          expected: def.type,
          received: typeof value
        });
      }
    }

    if (def.validate) {
      let ret = def.validate(def, value, options);
      if (ret instanceof Error) throw ret;
      if (!ret) throw new OptionsError('/server/options/validate', { key, value });
    }
    options[key] = value;
  }

  return options;
};
