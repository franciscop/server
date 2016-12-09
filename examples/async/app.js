var Chance = require('chance'),
    chance = new Chance();

// Use with `node --harmony-async-await app.js`
// app.js
// const timeout = function (delay) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("Solved");
//       resolve();
//     }, delay)
//   })
// }
//
// async function timer () {
//   console.log('timer started')
//   await timeout(100);
//   console.log('timer finished')
// }
//
// console.log("A");
// timer();
// console.log("B");






// DEFINITION

// NOTE: this is NOT official; an official version might change this a lot so
// only use this for experimenting the possibilities, not for real-world cases
let identity = (...fields) => new Promise((resolve, reject) => {
  resolve(fields.map(field => chance[field.name]()));
});

function IdentityField(name, all) {
  let field = Object.assign({}, all, { name });
  field.prompt() = function(){};
  field.update() = function(){};
  return field;
}

// IMPLEMENTATION

identity(
  new IdentityField('name', { required: true, certainty: 5 }),
  new IdentityField('email', { required: true, certainty: 5 })
).then(user => {
  console.log(user);
});


// user.token    // browser-specific
// user.fields = { email: 'what@ever.com' }
//
// $('input').on('click', e => {
//   let field = new IdentityField('name', user[e.target.name], 'required', 'confirm');
//   let value = await field.change(e.target.value);
//   let res = await fetch('/user/' + id, {
//     method: 'PUT',
//     body: 'name=' + encodeURI(value)
//   }).then('');
// });






//
//
// // Nowadays
// app.use((req, res, next) => {
//   request('url', (err, data){
//     req.supradata = data;
//     next(err);
//   });
// });
//
// // It returns a promise
// app.use((req, res) => {
//   return new Promise((resolve, reject) => {
//     request('url', (err, data){
//       if (err) return reject(err);
//       req.supradata = data;
//       resolve();
//     });
//   });
// });
//
// // Imagine that request was async/promised (surely there are some)
// app.use((req, res, next) => {
//   try {
//     req.data = await request('url');
//     next();
//   } catch (err) {
//     next(err);
//   }
// });
//
// // WE return a promise
// app.use(swear((req, res) => {
//   req.data = await request('url');
// }));
//
// // No need for promises
// app.use((req, res) => {
//   req.data = await request('url');
// });
//
//
// app.use((req, res) => {
//   return new Promise((resolve, reject) => {
//     try {
//       req.data = await request('url');
//       resolve(data);
//     } catch (err) {
//       reject(err);
//     }
//   });
// });
//
// app.use((req, res, next) => {
//   req.data = await request('url');
//   next();
// });
