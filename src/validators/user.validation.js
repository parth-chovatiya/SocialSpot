const { ObjectId } = require("mongodb");

const { sendResponce } = require("../utils/sendResponce");
const { Users } = require("../models/Users");
const { isValidEmail, isValidPassword } = require("../utils/validation_utils");
const { getDB } = require("../DB/connectDB");
const {
  validateInsertData,
  validateUpdateData,
} = require("./generalValidation");

exports.registerValidation = async (ctx, next) => {
  try {
    const { username, email, birthDate } = ctx.request.body;

    if (birthDate) ctx.request.body.birthDate = new Date(birthDate);

    validateInsertData(ctx.request.body, Users);

    // Count the user with username or email
    const user = await ctx.db.collection("Users").findOne({
      $or: [{ username }, { email }],
    });
    // const user = await getDB()
    //   .collection("Users")
    //   .findOne({
    //     $or: [{ username }, { email }],
    //   });

    ctx.assert(
      user?.username !== username,
      400,
      "User already exists with this username."
    );
    ctx.assert(
      user?.email !== email,
      400,
      "User already exists with this email."
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

exports.updateProfileValidation = async (ctx, next) => {
  try {
    const { username, email, birthDate } = ctx.request.body;

    if (birthDate) ctx.request.body.birthDate = new Date(birthDate);

    validateUpdateData(ctx.request.body, Users);

    const User = ctx.db.collection("Users");

    const countUsername = await User.count({ username });
    ctx.assert(!countUsername, 400, "Enter unique username.");

    const countEmail = await User.count({ email });
    ctx.assert(!countEmail, 400, "Enter unique email.");

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

exports.isUserExists = async (_id) =>
  (await getDB()).collection("Users").countDocuments({ _id, isVerified: true });

// exports.setProfileValidation = async (ctx, next) => {
//   try {
//     validateInsertData(ctx.request.body, Users);

//     await next();
//   } catch (error) {
//     sendResponce({ ctx, statusCode: 400, message: error.message });
//   }
// };
