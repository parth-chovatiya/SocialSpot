const { ObjectId } = require("mongodb");
const { sendResponce } = require("../utils/sendResponce");

exports.validate_email = async (ctx, next) => {
  try {
    const { email } = ctx.request.body;

    console.log(email);

    const emailValidate = String(email)
      .toLowerCase()
      .match(/^(([a-zA-Z0-9._%]){3,})+@[a-zA-Z.-]+\.[a-zA-Z]{2,6}$/);

    ctx.assert(emailValidate, 400, "Enter valid email...");

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

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

exports.validate_username = async (ctx, next) => {
  try {
    const { username } = ctx.request.body;

    const usernameValidate = String(username).match(
      /^[A-Za-z][A-Za-z0-9_]{7,29}$/
    );

    ctx.assert(
      usernameValidate,
      400,
      "Password should contain atleast 8 char with uppercase, lowercase, digit & special character."
    );

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

exports.validate_is_email_verified = async (ctx, next) => {
  try {
    const User = ctx.db.collection("Users");

    const user = await User.findOne({ _id: new ObjectId(ctx._id) });

    ctx.assert(user.isEmailVerified, 400, "Please verify your email.");

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
