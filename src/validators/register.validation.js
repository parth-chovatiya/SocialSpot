const { sendResponce } = require("../utils/sendResponce");
const { Users } = require("../models/Users");
const { ObjectId } = require("mongodb");
const { validateData } = require("./validateData");

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
      "User already exists with this username or password."
    );

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
