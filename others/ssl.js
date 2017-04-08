const server = require('server');

// No SSL
server();

// HTTP and HTTPS
server({
  ssl: {
    port: 443,
    key: './ssl/privatekey.pem',
    cert: './ssl/certificate.pem'
  }
});

// Only HTTPS
server({
  http: false,
  ssl: {
    port: 443,
    key: './ssl/privatekey.pem',
    cert: './ssl/certificate.pem'
  }
});
