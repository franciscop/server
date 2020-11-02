const server = require("../../server");
const { get, post } = server.router;
const { render } = server.reply;

server(
  get("/", (ctx) => render("index.hbs")),
  get("/:id", (ctx) => render("page.hbs", { page: ctx.params.id }))
);
