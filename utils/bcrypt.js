const bcrypt = require('bcrypt');

const hash = async (value) => bcrypt.hashSync(value, 10);

const compare = async (value, hashedValue) => bcrypt.compareSync(value, hashedValue);

module.exports = {
  hash,
  compare,
};
