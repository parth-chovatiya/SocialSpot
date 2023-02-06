const { ObjectId } = require("mongodb");
const { sendResponce } = require("../utils/sendResponce");

// check whether email is valid or not
exports.validate_email = async (ctx, next) => {
  try {
    const { email } = ctx.request.body;

    const emailValidate = String(email)
      .toLowerCase()
      .match(/^(([a-zA-Z0-9._%]){3,})+@[a-zA-Z.-]+\.[a-zA-Z]{2,6}$/);

    ctx.assert(emailValidate, 400, "Enter valid email...");

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// check whether password is valid or not
// min 6 char with 1-lowercase, 1-uppercase, 1-special char, 1-digit
exports.validate_password = async (ctx, next) => {
  try {
    const { password } = ctx.request.body;

    const passwordValidate = String(password).match(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d(?=.*@$!%*?&)]{8,16}$/
    );
    ctx.assert(
      passwordValidate,
      400,
      "Password should contain atleast 8 char with uppercase, lowercase, digit & special character."
    );

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// check whether username is valid or not
// min 7-char
exports.validate_username = async (ctx, next) => {
  try {
    const { username } = ctx.request.body;

    const usernameValidate = String(username).match(
      /^[A-Za-z][A-Za-z0-9_]{7,29}$/
    );

    ctx.assert(usernameValidate, 400, "Username should be min 7 character");

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
