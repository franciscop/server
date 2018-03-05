const server = require('../../server');
const { get } = server.router;
const { render } = server.reply;

const engine = {
  nunjucks: (file, options) => require('nunjucks').render(file, options)
};

const chai = 'Chai Name';
server({ engine }, ctx => render('index.nunjucks', { chai }));
