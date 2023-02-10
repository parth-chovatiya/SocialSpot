const { ObjectId } = require("mongodb");

exports.isValidEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(/^(([a-zA-Z0-9._%]){3,})+@[a-zA-Z.-]+\.[a-zA-Z]{2,6}$/);

exports.isValidUsername = (username) =>
  String(username).match(/^[A-Za-z][A-Za-z0-9_]{7,29}$/);

exports.isValidPassword = (password) =>
  String(password).match(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d(?=.*@$!%*?&)]{8,16}$/
  );

exports.isValidObjectId = (ownerId) =>
  ObjectId.isValid(ownerId) && String(new ObjectId(ownerId)) === ownerId;
