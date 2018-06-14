import bodyParser from 'body-parser';
import compression from 'compression';
// import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import debug from 'debug';
import dotenv from 'dotenv';
// import express from 'express';  // Issue when importing, not when bundling
// import expressDataParser from 'express-data-parser';
import expressSession from 'express-session';
import extend from 'extend';
// import hbs from 'hbs';
import helmet from 'helmet';
import loadware from 'loadware';
// import log from 'log';
import methodOverride from 'method-override';
import mz from 'mz';
import pathToRegexpWrap from 'path-to-regexp-wrap';
import pkgDir from 'pkg-dir';
// import pug from 'pug';
import responseTime from 'response-time';
import serveFavicon from 'serve-favicon';
// import serveIndex from 'serve-index';
// import socketIo from 'socket.io';
import socketioWildcard from 'socketio-wildcard';

export default {
  bodyParser,
  compression,
  // connectRedis,
  cookieParser,
  csurf,
  debug,
  dotenv,
  // express,
  // expressDataParser,
  expressSession,
  extend,
  // hbs,
  helmet,
  loadware,
  // log,
  methodOverride,
  mz,
  pathToRegexpWrap,
  pkgDir,
  // pug,
  responseTime,
  serveFavicon,
  // serveIndex,
  // socketIo,
  socketioWildcard
};
