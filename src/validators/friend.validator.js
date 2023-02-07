const { ObjectId } = require("mongodb");

const { Friends } = require("../models/Friends");
const { sendResponce } = require("../utils/sendResponce");
const { isUserExists, isValidObjectId } = require("./generalValidation");
const { validateData } = require("./validateData");

exports.validateFriend = async (ctx, next) => {
  try {
    const senderId = new ObjectId(ctx._id);
    const receiverId = ctx.request.body.receiverId;

    if (!isValidObjectId(ctx.request.body.receiverId)) {
      throw new Error("Enter valid obejctId");
    }
    ctx.request.body.senderId = new ObjectId(ctx._id);
    ctx.request.body.receiverId = new ObjectId(receiverId);

    // User can't send friend request to them self
    ctx.assert(
      senderId.toString() !== receiverId.toString(),
      400,
      "You can't send friend request to this user."
    );

    const Friend = await ctx.db.collection("Friends");

    // check user exists or not
    const user = await isUserExists(new ObjectId(receiverId));
    ctx.assert(user, 404, "User does not exists.");

    // check if friend request sended earlier or not
    const isExists = await Friend.count({
      $or: [
        { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
        { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
      ],
    });
    ctx.assert(!isExists, 200, "Friend request already sended.");

    validateData(ctx.request.body, Friends);

    await next();
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

exports.isFriendRequestSended = async (ctx, next) => {
  try {
    const senderId = new ObjectId(ctx._id);
    const receiverId = new ObjectId(ctx.request.body.receiverId);

    const isExists = await ctx.db.collection("Friends").count({
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
      message: error.message || "Something went wrong.",
    });
  }
};
