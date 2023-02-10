const { ObjectId } = require("mongodb");

// validate email
exports.isValidEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(/^(([a-zA-Z0-9._%]){3,})+@[a-zA-Z.-]+\.[a-zA-Z]{2,6}$/);

// validate username
exports.isValidUsername = (username) =>
  String(username).match(/^[A-Za-z][A-Za-z0-9_]{7,29}$/);

// validate password
exports.isValidPassword = (password) =>
  String(password).match(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d(?=.*@$!%*?&)]{8,16}$/
  );

// calidate objectId
exports.isValidObjectId = (ownerId) =>
  ObjectId.isValid(ownerId) && String(new ObjectId(ownerId)) === ownerId;

// validate mobil number
exports.isValidMobileNumber = (mobileNumber) =>
  String(mobileNumber).match(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  );
