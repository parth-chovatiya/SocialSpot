const { ObjectId } = require("bson");

const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/friend/sendFriendRequest
// @desc    Send Friend Request
// @access  Private
exports.sendFriendRequest = async (ctx) => {
  try {
    const senderId = new ObjectId(ctx._id);
    const receiverId = new ObjectId(ctx.request.body.receiverId);

    ctx.assert(
      senderId.toString() !== receiverId.toString(),
      400,
      "You can't send friend request to this user."
    );

    const User = await ctx.db.collection("Users");
    const Friend = await ctx.db.collection("Friends");

    const user = await User.findOne({ _id: new ObjectId(receiverId) });
    ctx.assert(user && user.isEmailVerified, 404, "User does not exists.");

    const isExists = await Friend.findOne({
      $or: [
        { $and: [{ senderId }, { receiverId }] },
        { $and: [{ receiverId }, { senderId }] },
      ],
    });

    ctx.assert(!isExists, 400, "Friend request already sended.");

    const friend = await Friend.insertOne({
      senderId: new ObjectId(senderId),
      receiverId: new ObjectId(receiverId),
      requestAccepted: false,
      createdAt: new Date(),
    });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Friend request sended.",
    });
  } catch (error) {
    console.log(error);
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   POST /api/v1/friend/acceptFriendRequest
// @desc    Accept Friend Request
// @access  Private
exports.acceptFriendRequest = async (ctx) => {
  try {
    const friendId = new ObjectId(ctx.request.body.friendId);
    const _id = new ObjectId(ctx._id);

    const Friend = await ctx.db.collection("Friends");

    const friend = await Friend.findOneAndUpdate(
      {
        $or: [
          { $and: [{ senderId: _id }, { receiverId: friendId }] },
          { $and: [{ receiverId: friendId }, { senderId: _id }] },
        ],
      },
      {
        $set: {
          requestAccepted: true,
        },
      }
    );

    sendResponce({ ctx, statusCode: 200, message: "Request accepted." });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
