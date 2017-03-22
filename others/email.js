// Email experiment:
const email = require('email')({ from: 'me@example.com', type: 'text' });

// Footprint
email(OPTIONS, SUBJECT, BODY);

// Simple case
email('test@example.com', 'Hello world', 'Body of the email');

// Multiple recipients
const people = ['test@example.com', 'test2@example.com'];
email(people, 'Hello world', 'Body of the email');

// Option-based case
email({ to: 'test@example.com' }, 'Hello world', 'Body of the email');

// Send HTML
const opts = { to: 'test@example.com', type: 'html' };
email(opts, 'Hello world', '<strong>Body of the email</strong>');







// Current "best" (sendGrid)
var helper = require('sendgrid').mail;
var from_email = new helper.Email('test@example.com');
var to_email = new helper.Email('test@example.com');
var subject = 'Hello World from the SendGrid Node.js Library!';
var content = new helper.Content('text/plain', 'Hello, Email!');
var mail = new helper.Mail(from_email, subject, to_email, content);

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});

sg.API(request, function(error, response) {
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
});
