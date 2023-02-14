const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const { sendResponce } = require("../utils/sendResponce");
const { generateToken } = require("../utils/token");

// @route   POST /api/v1/auth/register
// @desc    Register User
// @access  Public
exports.register = async (ctx) => {
  try {
    const User = await ctx.db.collection("Users");

    const user = ctx.request.body;
    user.password = await bcrypt.hash(user.password, 8);

    // const salt = await bcrypt.genSalt(10);

    const insertedUser = await User.insertOne(user);
    const token = await generateToken({ _id: insertedUser.insertedId });

    sendResponce({
      ctx,
      statusCode: 201,
      message: "Account created.",
      insertedUser,
      token,
    });
  } catch (error) {
    console.log(error);
    sendResponce({
      ctx,
      statusCode: 400,
      message: "Please create account agains.",
      error,
    });
  }
};

// @route   POST /api/v1/auth/login
// @desc    Login User
// @access  Public
exports.login = async (ctx) => {
  try {
    const { username, email, password } = ctx.request.body;

    const user = await ctx.db.collection("Users").findOne(
      { $or: [{ username }, { email }] },
      {
        projection: {
          isBlocked: 0,
          isDeleted: 0,
          createdAt: 0,
          modifiedAt: 0,
        },
      }
    );
    ctx.assert(user, 401, "Please, Enter valid credentials..");

    // Compare password
    const verifyPassword = await bcrypt.compare(password, user.password);
    ctx.assert(verifyPassword, 401, "Please Login again...");

    // Generate authToken
    const token = await generateToken({ _id: user._id });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: 400,
      error: error.message,
    });
  }
};

// @route   GET /api/v1/auth/verifyEmail/:id
// @desc    To verify email
// @access  Public
exports.verifyEmail = async (ctx) => {
  try {
    // Write logic to verify email

    const _id = ctx.params.id;

    const verifiedUser = await ctx.db
      .collection("Users")
      .findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: { isVerified: true } }
      );
    ctx.assert(verifiedUser.value, 404, "User not found.");

    if (verifiedUser.value?.isVerified) {
      return sendResponce({
        ctx,
        statusCode: 200,
        message: "User is already verified",
      });
    }

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Email verified.",
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};
