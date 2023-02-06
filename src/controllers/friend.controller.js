const { ObjectId } = require("bson");
const { fetchAllFriends } = require("../queries/friend.queries");

const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/friend/sendFriendRequest
// @desc    Send Friend Request
// @access  Private
exports.sendFriendRequest = async (ctx) => {
  try {
    const { senderId, receiverId } = ctx.request.body;

    const Friend = await ctx.db.collection("Friends");

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
      },
      {
        returnDocument: "after",
      }
    );

    ctx.assert(
      friend.lastErrorObject.updatedExisting,
      400,
      "Friend Request not found."
    );

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Request accepted.",
      friend,
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

    // const friends = await Friend.aggregate([
    //   {
    //     $match: {
    //       $expr: {
    //         $and: [
    //           {
    //             $or: [
    //               {
    //                 $eq: [_id, "$senderId"],
    //               },
    //               {
    //                 $eq: [_id, "$receiverId"],
    //               },
    //             ],
    //           },
    //           {
    //             $eq: ["$requestAccepted", true],
    //           },
    //         ],
    //       },
    //     },
    //   },
    //   {
    //     // project the only friend id
    //     $project: {
    //       _id: 0,
    //       friend: {
    //         $cond: {
    //           if: {
    //             $eq: ["$senderId", _id],
    //           },
    //           then: "$receiverId",
    //           else: "$senderId",
    //         },
    //       },
    //       createdAt: 1,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "Users",
    //       localField: "friend",
    //       foreignField: "_id",
    //       pipeline: [
    //         {
    //           $project: {
    //             _id: 0,
    //             username: 1,
    //             profilePic: 1,
    //             fullName: {
    //               $concat: [
    //                 "$firstName",
    //                 {
    //                   $cond: {
    //                     if: {
    //                       $eq: ["$lastName", null],
    //                     },
    //                     then: "",
    //                     else: {
    //                       $concat: [" ", "$lastName"],
    //                     },
    //                   },
    //                 },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: "friend",
    //     },
    //   },
    //   {
    //     $unwind: "$friend",
    //   },
    //   {
    //     $project: {
    //       username: "$friend.username",
    //       fullName: "$friend.fullName",
    //       profilePic: "$friend.profilePic",
    //       createdAt: "$createdAt",
    //     },
    //   },
    // ]).toArray();

    const friends = await fetchAllFriends({ Friend, filter: { _id } });

    sendResponce({ ctx, statusCode: 200, friends });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
