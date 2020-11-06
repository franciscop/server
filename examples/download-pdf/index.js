const fs = require("fs");
const util = require("util");
const server = require("../../server");
const { header } = server.reply;

// Read it and store it in a variable, emulating a pdf generated on-the-fly
const read = util.promisify(fs.readFile);
const generatePdf = () => read("./sample.pdf", "utf-8");

// Trigger the download with server.js
const downloadPdf = (data, name) => {
  return header({ "Content-Disposition": `attachment;filename="${name}"` })
    .type("application/pdf")
    .send(new Buffer(data));
};

server(async () => {
  // It can be created manually, file read, or other ways
  const pdf = await generatePdf();

  // Prompt the browser to download it with a new name
  return downloadPdf(pdf, "test.pdf");
});
