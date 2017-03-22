// User
// const options = { models: require('auto-load')('models') };
const bcrypt = require('bcrypt');

module.exports = {
  identity: 'user',
  connection: 'myPostgres',
  attributes: {
    email: { type: 'string', email: true, required: true, unique: true },
    name: { type: 'string', required: true },
    password: { type: 'string', required: true }
  },
  beforeCreate: (data, next) => {
    bcrypt.hash(data.password, 10).then(hash => {
      data.password = hash;
      next();
    }).catch(next);
  }
};
