const { ObjectId } = require("mongodb");

const { sendResponce } = require("../utils/sendResponce");
const { Users } = require("../models/Users");
const { validateData } = require("./validateData");
const { isValidEmail, isValidPassword } = require("./generalValidation");

exports.registerValidation = async (ctx, next) => {
  try {
    const { username, email } = ctx.request.body;
    const User = ctx.db.collection("Users");

    validateData(ctx.request.body, Users);

    const countUser = await User.count({
      $or: [{ username }, { email }],
    });

    ctx.assert(
      !countUser,
      400,
      "User already exists with this username or email."
    );

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

exports.loginValidation = async (ctx, next) => {
  try {
    ctx.assert(isValidEmail(ctx.request.body.email), 400, "Enter valid email.");
    ctx.assert(
      isValidPassword(ctx.request.body.password),
      400,
      "Enter valid password."
    );

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
