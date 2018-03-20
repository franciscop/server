const fs = require('fs');
const path = require('path');

const img = path.resolve('../../test/logo.png');

require('../../server')(ctx => {
  return new Promise(resolve => {
    fs.createReadStream(img).pipe(ctx.res).on('end', resolve);
  });
});
