const { csurf, helmet } = require('../../packages');

module.exports = {
  name: 'security',
  options: {
    csrf: {
      env: 'SECURITY_CSRF',
      default: {},
      type: Object
    },
    contentSecurityPolicy: {
      env: 'SECURITY_CONTENTSECURITYPOLICY'
    },
    expectCt: {
      env: 'SECURITY_EXPECTCT'
    },
    dnsPrefetchControl: {
      env: 'SECURITY_DNSPREFETCHCONTROL'
    },
    frameguard: {
      env: 'SECURITY_FRAMEGUARD'
    },
    hidePoweredBy: {
      env: 'SECURITY_HIDEPOWEREDBY'
    },
    hpkp: {
      env: 'SECURITY_HPKP'
    },
    hsts: {
      env: 'SECURITY_HSTS'
    },
    ieNoOpen: {
      env: 'SECURITY_IENOOPEN'
    },
    noCache: {
      env: 'SECURITY_NOCACHE'
    },
    noSniff: {
      env: 'SECURITY_NOSNIFF'
    },
    referrerPolicy: {
      env: 'SECURITY_REFERRERPOLICY'
    },
    xssFilter: {
      env: 'SECURITY_XSSFILTER'
    }
  },
  before: [
    ctx => ctx.options.security && ctx.options.security.csrf
      ? ctx.utils.modern(csurf(ctx.options.security.csrf))(ctx)
      : false,
    ctx => {
      // Set the csrf for render(): https://expressjs.com/en/api.html#res.locals
      if (ctx.req && ctx.req.csrfToken) {
        ctx.csrf = ctx.req.csrfToken();
        ctx.res.locals.csrf = ctx.csrf;
      }
    },
    // The whole plugin will be deactivated if the security is false
    ctx => ctx.utils.modern(helmet(ctx.options.security))(ctx)
  ]
};
