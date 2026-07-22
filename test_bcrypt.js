const bcrypt = require('bcryptjs');
const hash = '$2a$10$PqnAU3dtyKSriGdi1mj3PeSyUpaKlqbxXVAanXCgFGm0nsQS7jjrW';
console.log('admin123:', bcrypt.compareSync('admin123', hash));
