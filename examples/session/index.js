// Simple visit counter for the main page
const server = require("../../server");
const counter = (ctx) => {
  const session = ctx.session;
  session.views = (session.views || 0) + 1;
  return `Session: ${session.views}`;
};
server(counter);
