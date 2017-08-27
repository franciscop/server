const OptionsError = require('./errors');
const path = require('path');

// For options that default to true
// const trueorundef = value => typeof value === 'undefined' || value === true;

// Primitives to test
// const types = ['Boolean', 'Number', 'String', 'Array', 'Object'];

module.exports = async function(schema, arg = {}, env= {}, all = {}) {
  console.log("ARGS:", arg);
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
    let value;

    // Skip the control variables such as '__root'
    if (/^\_\_/.test(key)) continue;

    // Make sure we are dealing with a valid definition
    if (typeof def !== 'object') {
      throw new Error('Invalid option definition: ' + JSON.stringify(def));
    }

    // Decide whether to use the argument or not
    if (def.arg === false) {

      // No argument expected but one was passed
      if (arg[key]) {
        throw new OptionsError('/server/options/noarg', { key });
      }
    } else {
      def.arg = def.arg === true ? key : def.arg || key;
    }

    // Decide whether to use the environment or not
    if (def.env === false) {
      // No argument expected but one was passed
      if (env[key.toUpperCase()]) {
        throw new OptionsError('/server/options/noenv', { key });
      }
    } else {
      def.env = (def.env === true ? key : def.env || key).toUpperCase();
    }

    // List of possibilities, from HIGHER preference to LOWER preference
    const possible = [
      env[def.env],
      arg[def.arg],
      all[def.inherit],
      def.default
    ].filter(value => typeof value !== 'undefined');
    if (possible.length) {
      value = possible[0];
    }

    if (def.find) {
      value = await def.find(arg, env, all, schema);
    }

    // Extend the base object or user object with new values if these are not set
    if (def.extend && (typeof value === 'undefined' || typeof value === 'object')) {
      if (typeof value === 'undefined') {
        value = {};
      }
      Object.assign(value, def.default, value);
    }

    // Normalize the "public" pub
    if (def.file && typeof value === 'string') {
      if (!path.isAbsolute(value)) {
        value = path.join(process.cwd(), value);
      }
      value = path.normalize(value);
    }

    if (def.clean) {
      value = def.clean(value, arg, env, all, schema);
    }




    // VALIDATION
    // Validate that it is set
    if (def.required) {
      if (typeof value === 'undefined') {
        throw new OptionsError('/server/options/required', { key });
      }
      // TODO: check that the file and folder exist
    }

    if (def.enum) {
      if (!def.enum.includes(value)) {
        throw new OptionsError('/server/options/enum', { key, value, possible: def.enum });
      }
    }

    // Validate the type (only if there's a value)
    if (def.type && value) {

      // Parse valid types into a simple array of strings: ['string', 'number']
      def.type = (def.type instanceof Array ? def.type : [def.type])
        // pulls up the name for primitives such as String, Number, etc
        .map(one => (one.name ? one.name : one).toLowerCase());

      // Make sure it is one of the valid types
      if (!def.type.includes(typeof value)) {
        throw new OptionsError('/server/options/type', {
          key,
          expected: def.type,
          received: typeof value,
          value
        });
      }
    }

    if (def.validate) {
      let ret = def.validate(value, def, options);
      if (ret instanceof Error) throw ret;
      if (!ret) throw new OptionsError('/server/options/validate', { key, value });
    }
    options[key] = value;
  }

  return options;
};
