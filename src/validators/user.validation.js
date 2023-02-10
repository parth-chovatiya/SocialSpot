const { ObjectId } = require("mongodb");

const { sendResponce } = require("../utils/sendResponce");
const { Users } = require("../models/Users");
const { validateInsertData } = require("./validateInsertData");
const { isValidEmail, isValidPassword } = require("../utils/validation_utils");
const { getDB } = require("../DB/connectDB");

exports.registerValidation = async (ctx, next) => {
  try {
    const { username, email } = ctx.request.body;
    const User = ctx.db.collection("Users");

    validateInsertData(ctx.request.body, Users);

    // Count the user with username or email
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
    console.log(error);
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

exports.isUserExists = (_id) =>
  getDB().collection("Users").countDocuments({ _id, isVerified: true });

// exports.setProfileValidation = async (ctx, next) => {
//   try {
//     validateInsertData(ctx.request.body, Users);

//     await next();
//   } catch (error) {
//     sendResponce({ ctx, statusCode: 400, message: error.message });
//   }
// };
