const { ObjectId } = require("mongodb");
const { pageSize } = require("../utils/pagination");

const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/user/profile
// @desc    complete profile
// @access  Private
exports.setProfile = async (ctx) => {
  try {
    const user = await ctx.db.collection("Users").findOneAndUpdate(
      { _id: new ObjectId(ctx._id) },
      { $set: ctx.request.body },
      {
        returnDocument: "after",
        projection: {
          password: 0,
          isBlocked: 0,
          isDeleted: 0,
          createdAt: 0,
          modifiedAt: 0,
        },
      }
    );
    sendResponce({
      ctx,
      statusCode: 200,
      message: "Profile updated.",
      user: user.value,
    });
  } catch (error) {
    console.log(error);
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// @route   GET /api/v1/user/profile
// @desc    fetch user profile
// @access  Private
exports.getProfile = async (ctx) => {
  try {
    const User = await ctx.db.collection("Users");
    const user = await User.findOne(
      { _id: new ObjectId(ctx._id) },
      {
        projection: {
          password: 0,
          isBlocked: 0,
          isDeleted: 0,
          createdAt: 0,
          modifiedAt: 0,
        },
      }
    );
    ctx.assert(user, 404, "User not found");

    sendResponce({ ctx, statusCode: 200, message: "User fetched.", user });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// @route   POST /api/v1/user/search
// @desc    Search user profile -> username, firstname, lastname
// @access  Public
exports.searchUsers = async (ctx) => {
  try {
    const { text = "" } = ctx.request.body;
    const { page, limit, sortBy } = ctx.query;
    console.log(page, limit, sortBy);

    // const users = await ctx.db
    //   .collection("Users")
    //   .find({ $text: { $search: text, $caseSensitive: false } })
    //   .toArray();

    // const users = await ctx.db
    //   .collection("Users")
    //   .find({
    //     $or: [
    //       { username: { $regex: text, $options: "i" } },
    //       { firstName: { $regex: text, $options: "i" } },
    //       { lastName: { $regex: text, $options: "i" } },
    //     ],
    //   })
    //   .project({
    //     password: 0,
    //     isVerified: 0,
    //     isBlocked: 0,
    //     isDeleted: 0,
    //     modifiedAt: 0,
    //   })
    //   .toArray();
    const users = await ctx.db
      .collection("Users")
      .aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  { username: { $regex: text, $options: "i" } },
                  { firstName: { $regex: text, $options: "i" } },
                  { lastName: { $regex: text, $options: "i" } },
                ],
              },
              { isVerified: true },
            ],
          },
        },
        {
          $project: {
            password: 0,
            isVerified: 0,
            isBlocked: 0,
            isDeleted: 0,
            createdAt: 0,
            modifiedAt: 0,
            mobileNumber: 0,
            gender: 0,
          },
        },
        { $skip: page * pageSize },
        { $limit: parseInt(limit) },
      ])
      .toArray();

    sendResponce({ ctx, statusCode: 200, users });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
