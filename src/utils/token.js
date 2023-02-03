const jwt = require("jsonwebtoken");

exports.generateToken = (data) => {
  return jwt.sign(data, process.env.SECRET_JWT_KEY);
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET_JWT_KEY);
};
