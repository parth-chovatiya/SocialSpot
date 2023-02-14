const { ObjectId } = require("mongodb");

const {
  fetchAllFriendsQuery,
  fetchFriendRequestsQuery,
} = require("../queries/friend.queries");
const { sendResponce } = require("../utils/sendResponce");
const {
  fetchFullName,
  replaceRootFullname,
} = require("../utils/mongodb_utils");

// @route   POST /api/v1/friend/sendFriendRequest
// @desc    Send Friend Request
// @access  Private
exports.sendFriendRequest = async (ctx) => {
  try {
    const friend = await ctx.db
      .collection("Friends")
      .insertOne(ctx.request.body);

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Friend request sended.",
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   POST /api/v1/friend/acceptFriendRequest
// @desc    Accept Friend Request
// @access  Private
exports.acceptFriendRequest = async (ctx) => {
  try {
    const friendId = new ObjectId(ctx.params.friendId);
    const _id = new ObjectId(ctx._id);

    const friend = await ctx.db.collection("Friends").findOneAndUpdate(
      {
        $and: [
          { $and: [{ senderId: friendId }, { receiverId: _id }] },
          { requestAccepted: false },
        ],
      },
      { $set: { requestAccepted: true } },
      { returnDocument: "after" }
    );

    ctx.assert(
      friend.lastErrorObject.updatedExisting,
      404,
      "Friend Request not found."
    );

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Request accepted.",
      friend: friend.value,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   GET /api/v1/friend/friends
// @desc    Fetched all friends
// @access  Private
exports.allFriends = async (ctx) => {
  try {
    const Friend = ctx.db.collection("Friends");

    const _id = new ObjectId(ctx._id);

    const friends = await fetchAllFriendsQuery({ Friend, filter: { _id } });
    console.log(friends);

    sendResponce({ ctx, statusCode: 200, friends });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   GET /api/v1/friend/friendRequests
// @desc    Fetched all friend request
// @access  Private
exports.friendRequests = async (ctx) => {
  try {
    const _id = new ObjectId(ctx._id);

    const Friend = ctx.db.collection("Friends");
    const friendRequest = await fetchFriendRequestsQuery({
      Friend,
      filter: { _id },
    });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Friend request fetched",
      friendRequest,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/friend/cancelFriendRequest
// @desc    Cancel friend request
// @access  Private
exports.cancelFriendRequest = async (ctx) => {
  try {
    const friendId = new ObjectId(ctx.params.friendId);

    const friendRequest = await ctx.db.collection("Friends").findOneAndDelete({
      $and: [
        {
          $and: [{ senderId: friendId }, { receiverId: new ObjectId(ctx._id) }],
        },
        { requestAccepted: false },
      ],
    });

    ctx.assert(friendRequest.value, 404, "Friend Request not found.");

    sendResponce({ ctx, statusCode: 200, friendRequest });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/friend/removeFriend
// @desc    Remove from my friend list
// @access  Private
exports.removeFriend = async (ctx) => {
  try {
    const _id = new ObjectId(ctx._id);
    const friendId = new ObjectId(ctx.params.friendId);

    const Friend = ctx.db.collection("Friends");
    const friendRequest = await Friend.findOneAndDelete({
      $and: [
        {
          $or: [
            { $and: [{ senderId: _id }, { receiverId: friendId }] },
            { $and: [{ senderId: friendId }, { receiverId: _id }] },
          ],
        },
        { requestAccepted: true },
      ],
    });

    if (!friendRequest.value) {
      return sendResponce({
        ctx,
        statusCode: 400,
        message: "May be he/she is not your friend.",
      });
    }

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Removed from your friend list",
      friend: friendRequest.value,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   GET /api/v1/friend/sendedFriendRequests
// @desc    Fetch all sended friend requests which i hve sended
// @access  Private
exports.sendedFriendRequests = async (ctx) => {
  try {
    const friendRequests = await ctx.db
      .collection("Friends")
      .aggregate([
        { $match: { senderId: ctx._id, requestAccepted: false } },
        { ...fetchFullName("receiverId", "_id", "fullName", "user") },
        { ...replaceRootFullname("user") },
        { $project: { profilePic: 1, fullName: 1, sendedDate: "$createdAt" } },
      ])
      .toArray();

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Friend requests which you have sended to your friends.",
      friendRequests,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
