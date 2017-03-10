let server = require('../../server');
let { get, post } = server.router;

server(3000,
  get('/', (req, res) => res.render('index')),
  post('/upload', (req, res) => {

    // Here is your file, "userimage" as in name="userimage" in the form:
    console.log(req.files.userimage);
    console.log("Path:", req.files.userimage.path);

    res.redirect('/#goodjob');
  })
);
