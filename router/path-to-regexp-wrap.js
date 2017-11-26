// This comes from https://github.com/teologov/path-to-regexp-wrap
// because of this bug: https://github.com/franciscop/server/issues/43

/**
 * Path to regexp lib wrapper
 * @author Andrey Teologov <teologov.and@gmail.com>
 * @date 16.04.14
 */

"use strict";

const path = require('path-to-regexp');

/**
 * Routes lib
 * @type {exports}
 */
module.exports = function(options) {
  options = options || {};

  /**
   * String decoder
   * @param {String} str
   * @returns {*}
   */
  function decodeUri(str) {
    try {
      str = decodeURIComponent(str);
    } catch(e) {
      throw new Error(`Cannot decodeURIComponent: ${str}` );
    }
    return str;
  }

  return function(route) {
    const keys = [];
    const reg = path.apply(this, [route, keys, options]);

    return function(route, config) {
      const res = reg.exec(route);
      const params = config || {};

      if (!res) {
        return false;
      }

      for (let i = 1, l = res.length; i < l; i++) {
        if (!res[i]) {
          continue;
        }
        params[keys[i - 1].name] = decodeUri(res[i]);
      }

      return params;
    }
  }
};
