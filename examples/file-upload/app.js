let server = require('../../server');
let { get, post } = server.router;

server(3000,
  get('/', ctx => ctx.res.render('index')),
  post('/upload', ctx => {

    // Here is your file, "userimage" as in name="userimage" in the form:
    console.log(ctx.req.files.userimage);
    console.log("Path:", ctx.req.files.userimage.path);

    ctx.res.redirect('/#goodjob');
  })
);
