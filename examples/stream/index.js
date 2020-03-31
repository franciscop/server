const server = require("../../server");
const fs = require("fs");
const path = require("path");

const img = path.resolve("../../test/logo.png");
const stream = (read, write) =>
  new Promise((resolve, reject) => {
    read
      .pipe(write)
      .on("error", reject)
      .on("end", resolve);
  });

server(ctx => {
  return stream(fs.createReadStream(img), ctx.res);
});
