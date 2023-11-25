const bcrypt = require("bcrypt");

const hash = async (value) => {
  return await bcrypt.hash(value, 10);
};

const compare = async (value, hashedValue) => {
  return await bcrypt.compare(value, hashedValue);
};

module.exports = {
  hash,
  compare,
};
