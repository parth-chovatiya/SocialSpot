const bcrypt = require("bcrypt");

// hash the password
exports.hashPassword = async (password) => {
  // try to generate salt & store it in the database & replace 8 with salt
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  return bcrypt.hash(password, 8);
};

// compare the password
exports.comparePassword = (password, storedPassword) => {
  return bcrypt.compare(password, storedPassword);
};
