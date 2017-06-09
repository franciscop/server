const server = require('../../server');
const { get, post } = server.router;
const { render, redirect } = server.reply;

server(3000,
  get('/', ctx => render('index')),
  post('/upload', ctx => {

    // Here is your file, "userimage" as in name="userimage" in the form:
    console.log(ctx.req.files.userimage);
    console.log("Path:", ctx.req.files.userimage.path);

    redirect('/#goodjob');
  })
);
