const { FullName } = require("../utils/mongodb_utils");

// Send friend request query
exports.sendFriendRequestQuery = ({
  Friend,
  filter,
  newData,
  projection,
}) => {};

// Fetch all friends query
exports.fetchAllFriendsQuery = ({ Friend, filter, newData, projection }) => {
  const { _id } = filter;
  return Friend.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            {
              $or: [
                {
                  $eq: [_id, "$senderId"],
                },
                {
                  $eq: [_id, "$receiverId"],
                },
              ],
            },
            {
              $eq: ["$requestAccepted", true],
            },
          ],
        },
      },
    },
    {
      // project the only friend id
      $project: {
        _id: 0,
        friend: {
          $cond: {
            if: {
              $eq: ["$senderId", _id],
            },
            then: "$receiverId",
            else: "$senderId",
          },
        },
        createdAt: 1,
      },
    },
    {
      $lookup: {
        from: "Users",
        localField: "friend",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              username: 1,
              profilePic: 1,
              fullName: FullName,
            },
          },
        ],
        as: "friend",
      },
    },
    {
      // To replace the commented user info with the comment it self
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            {
              $arrayElemAt: ["$friend", 0],
            },
            "$$ROOT",
          ],
        },
      },
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        profilePic: 1,
        createdAt: 1,
      },
    },
  ]).toArray();
};

// Fetch friend requests query
exports.fetchFriendRequestsQuery = ({
  Friend,
  filter,
  newData,
  projection,
}) => {
  const { _id } = filter;

  return Friend.aggregate([
    {
      $match: {
        $and: [{ $or: [{ receiverId: _id }] }, { requestAccepted: false }],
      },
    },
    {
      $project: {
        _id: 0,
        createdAt: 1,
        friendId: {
          $cond: {
            if: { $eq: ["$senderId", _id] },
            then: "$receiverId",
            else: "$senderId",
          },
        },
      },
    },
    {
      $lookup: {
        from: "Users",
        localField: "friendId",
        foreignField: "_id",
        as: "friend",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$friend", 0] }, "$$ROOT"],
        },
      },
    },
    {
      $project: {
        username: 1,
        fullName: FullName,
        profilePic: 1,
      },
    },
  ]).toArray();
};
