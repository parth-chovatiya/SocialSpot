const jwt = require("jsonwebtoken");

// generate JWT token
exports.generateToken = (data) => {
  return jwt.sign(data, process.env.SECRET_JWT_KEY);
};

// verify JWT token
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET_JWT_KEY);
};
