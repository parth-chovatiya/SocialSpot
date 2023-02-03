const { sendResponce } = require("../utils/sendResponce");
const { Users } = require("../models/Users");
const { ObjectId } = require("mongodb");

exports.registerValidation = async (ctx, next) => {
  try {
    const { username, email } = ctx.request.body;
    const User = ctx.db.collection("Users");

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
