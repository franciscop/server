# Upload files to Node.js

They just work. Create a form in *pug*:

```pug
form(action="/upload" method="post" enctype="multipart/form-data")
  input(type="file" name="userimage")
  input(type="submit" value="Upload image")
```

> Don't forget the `enctype="multipart/form-data"` inside the `<form>`; `server` cannot help you there

Then handle it with `server`:

```js
let server = require('server');
let { get, post } = server.router;

server(3000,
  get('/', (req, res) => res.render('index')),
  post('/upload', (req, res) => {

    // Here is your file, "userimage" as in name="userimage" in the form:
    console.log("All info:", req.files.userimage);
    console.log("Path:", req.files.userimage.path);

    res.redirect('/#goodjob');
  })
);
```


Once the file is uploaded it is normally stored in some temporary location. You can see this information in the `path` as shown above in `req.files.userimage.path`.

From there you want to move it to somewhere more durable. It will depend on where you want to store them; It might be simply in `./public/uploads` or you might want to use a 3rd party for delivery such as [Cloudinary](http://cloudinary.com/) (really easy API), [Amazon S3](https://aws.amazon.com/s3/) (good reliability, bad API) or others.

You can see an example with Cloudinary in [this Node.js tutorial I made](https://en.libre.university/lesson/4y0YY2H6b#Uploading-the-pictures), which should be roughly the same.
