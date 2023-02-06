const { ObjectId } = require("mongodb");
const { sendResponce } = require("../utils/sendResponce");

exports.validateFriend = async (ctx, next) => {
  try {
    const senderId = new ObjectId(ctx._id);
    const receiverId = new ObjectId(ctx.request.body.receiverId);

    ctx.request.body.senderId = ctx._id;

    // User can't send friend request to them self
    ctx.assert(
      senderId.toString() !== receiverId.toString(),
      400,
      "You can't send friend request to this user."
    );

    const User = await ctx.db.collection("Users");
    const Friend = await ctx.db.collection("Friends");

    // check user exists or not
    const user = await User.findOne({ _id: new ObjectId(receiverId) });
    ctx.assert(user && user.isVerified, 404, "User does not exists.");

    // check if friend request sended earlier or not
    const isExists = await Friend.count({
      $or: [
        { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
        { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
      ],
    });
    ctx.assert(!isExists, 200, "Friend request already sended.");

    await next();
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};
