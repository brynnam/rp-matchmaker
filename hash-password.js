// hash-password.js
const bcrypt = require('bcryptjs');

const password = 'password';
bcrypt.hash(password, 10).then(hash => {
  console.log('Hashed password:', hash);
});
