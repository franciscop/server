const packages = require('./');

describe('Packages', () => {
  it('only grows', () => {
    expect(Object.keys(packages)).toMatchObject([
      'bodyParser', 'compression', 'cookieParser', 'csurf', 'debug', 'dotenv',
      'express', 'expressSession', 'extend', 'helmet', 'loadware',
      'methodOverride', 'mz', 'pathToRegexpWrap', 'pkgDir', 'responseTime',
      'serveFavicon', 'socketioWildcard'
    ]);
  })
});
