// const join = require('./index.js');

describe('Performance', () => {
  it('dummy', () => {});

  // it('takes time to join promises', () => {
  //   const cb = ctx => ctx.count++;
  //
  //   const times = [10, 100, 1000, 10000, 100000];
  //   const promises = times.map(k => ctx => {
  //     const proms = [];
  //     for (let i = 0; i < k; i++) {
  //       proms.push(cb);
  //     }
  //     console.time('chained-' + k);
  //     return join(proms)({ count: 0 }).then(ctx => {
  //       console.timeEnd('chained-' + k);
  //     });
  //   });
  //
  //   return join(promises)({});
  // });
});


// Similar:
// Native:
// chained-10: 0.272ms
// chained-100: 1.052ms
// chained-1000: 13.040ms
// chained-10000: 81.560ms
// chained-100000: 882.968ms

// Bluebird (slower):
// chained-10: 1.711ms
// chained-100: 7.160ms
// chained-1000: 13.631ms
// chained-10000: 78.505ms
// chained-100000: 749.576ms
