// The simplest of the examples. Navigate to the folder, run 'node index.js'
// and open the browser on 'localhost:3000'
require('../../server')(ctx => { throw new Error('ERROR!'); });
