const { ObjectId } = require("mongodb");

const { sendResponce } = require("../utils/sendResponce");
const { verifyToken } = require("../utils/token");

exports.checkAuth = async (ctx, next) => {
  try {
    const token = ctx.header.authorization?.split(" ")[1];
    ctx.assert(token, 400, "Please, Login again.");

    const decoded = verifyToken(token);

    const User = await ctx.db.collection("Users");
    const user = await User.findOne(
      { _id: new ObjectId(decoded._id) },
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

    ctx._id = new ObjectId(decoded._id);
    ctx.user = user;

    ctx.assert(user, 400, "Please, Login again.");
    ctx.assert(user.isVerified, 400, "Please, verify your email.");

    await next();
  } catch (error) {
    console.log(error);
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
