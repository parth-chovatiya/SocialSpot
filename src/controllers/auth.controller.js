const { ObjectId } = require("mongodb");

const { hashPassword, comparePassword } = require("../utils/password");
const { sendResponce } = require("../utils/sendResponce");
const { generateToken } = require("../utils/token");

// @route   POST /api/v1/auth/register
// @desc    Register User
// @access  Public
exports.register = async (ctx) => {
  try {
    const User = await ctx.db.collection("Users");

    const user = ctx.request.body;
    user.password = await hashPassword(user.password);

    const insertedUser = await User.insertOne(user);

    sendResponce({
      ctx,
      statusCode: 201,
      message: "Account created.",
      insertedUser,
    });
  } catch (error) {
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
    const User = await ctx.db.collection("Users");

    const user = await User.findOne({ $or: [{ username }, { email }] });
    ctx.assert(user, 401, "Please, Enter valid credentials..");

    const verifyPassword = await comparePassword(password, user.password);

    ctx.assert(verifyPassword, 401, "Please Login again...");

    const token = await generateToken({ _id: user._id });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: 400,
      error: error.message,
    });
  }
};

// @route   GET /api/v1/auth/verifyEmail
// @desc    To verify email
// @access  Public
exports.verifyEmail = async (ctx) => {
  try {
    // Write logic to verify email

    const _id = ctx.params.id;
    console.log(_id);

    const User = ctx.db.collection("Users");

    const verifiedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      {
        $set: {
          isVerified: true,
        },
      },
      {
        returnDocument: "after",
      }
    );

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Email verified.",
      user: verifiedUser,
    });
  } catch (error) {
    console.log(error);
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
