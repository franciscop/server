const server = require("../../server");
const { get, post } = server.router;

const form = `
  <!DOCTYPE html>
  <html lang="en">
    <head><meta charset="UTF-8"><title>File Upload Demo</title></head>
    <body>
      <form action="/" method="POST" enctype='multipart/form-data'>
        <input type="text" name="name" required />
        <input type="file" name="picture" required />
        <button>Send</button>
      </form>
    </body>
  </html>
`;

server(
  { security: { csrf: false } },
  get("/", () => form),
  post("/", (ctx) => {
    // Here is your file, "picture" as in name="picture" in the form:
    console.log(ctx.files.picture);
    console.log("Path:", ctx.files.picture.path);

    return ctx.files.picture;
  }),
  get("/favicon.ico", () => 404)
);
