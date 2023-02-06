const { ObjectId } = require("mongodb");

const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/user/profile
// @desc    complete profile
// @access  Private
exports.setProfile = async (ctx) => {
  try {
    const { username, email } = ctx.request.body;
    const User = ctx.db.collection("Users");

    const countUsername = await User.count({ username });
    ctx.assert(!countUsername, 400, "Enter unique username.");

    const countEmail = await User.count({ email });
    ctx.assert(!countEmail, 400, "Enter unique email.");

    const user = await User.findOneAndUpdate(
      { _id: new ObjectId(ctx._id) },
      { $set: ctx.request.body },
      { returnDocument: "after" }
    );
    sendResponce({ ctx, statusCode: 200, message: "Profile updated.", user });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// @route   GET /api/v1/user/profile
// @desc    fetch user profile
// @access  Private
exports.getProfile = async (ctx) => {
  try {
    const User = await ctx.db.collection("Users");
    const user = await User.find({ _id: new ObjectId(ctx._id) }).toArray();

    ctx.assert(user, 404, "User not found");

    sendResponce({ ctx, statusCode: 200, message: "User fetched.", user });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
