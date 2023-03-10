const { ObjectId } = require("mongodb");

const { Friends } = require("../models/Friends");
const { sendResponce } = require("../utils/sendResponce");
const { isValidObjectId } = require("../utils/validation_utils");
const { validateInsertData } = require("./generalValidation");
const { isUserExists } = require("./user.validation");

exports.validateFriend = async (ctx, next) => {
  try {
    const senderId = new ObjectId(ctx._id);
    const receiverId = new ObjectId(ctx.params.friendId);

    if (!isValidObjectId(ctx.params.friendId)) {
      throw new Error("Enter valid friendId");
    }
    ctx.request.body.senderId = senderId;
    ctx.request.body.receiverId = receiverId;

    validateInsertData(ctx.request.body, Friends);

    // User can't send friend request to them self
    ctx.assert(
      senderId.toString() !== receiverId.toString(),
      400,
      "You can't send friend request to this user."
    );

    const Friend = await ctx.db.collection("Friends");

    // check user exists or not
    const user = await isUserExists(receiverId);
    ctx.assert(user, 404, "User does not exists.");

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

exports.isFriendRequestSended = async (ctx, next) => {
  try {
    const senderId = new ObjectId(ctx._id);
    const receiverId = new ObjectId(ctx.params.friendId);

    const isExists = await ctx.db.collection("Friends").findOne({
      $and: [
        {
          $or: [
            { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
            { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
          ],
        },
        { requestAccepted: false },
      ],
    });
    ctx.assert(isExists, 404, "No Friend Request Found..");

    await next();
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong.",
    });
  }
};

exports.isBothFriend = async (ctx, next) => {
  try {
    const senderId = new ObjectId(ctx._id);
    const receiverId = new ObjectId(ctx.params.friendId);

    const isExists = await ctx.db.collection("Friends").findOne({
      $and: [
        {
          $or: [
            { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
            { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
          ],
        },
        { requestAccepted: true },
      ],
    });
    ctx.assert(!isExists, 400, "You are already friends.");

    console.log(isExists);

    await next();
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong.",
    });
  }
};

exports.isBothFriendChat = async (ctx, next) => {
  try {
    const senderId = new ObjectId(ctx._id);
    const receiverId = new ObjectId(ctx.params.friendId);

    const isExists = await ctx.db.collection("Friends").findOne({
      $and: [
        {
          $or: [
            { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
            { $and: [{ senderId: receiverId }, { receiverId: senderId }] },
          ],
        },
        { requestAccepted: true },
      ],
    });
    console.log("isExists", senderId, receiverId, isExists);
    ctx.assert(isExists, 400, "You are not friends.");

    await next();
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong.",
    });
  }
};
