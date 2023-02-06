// To merge the firstName with lastName
const FullName = {
  $concat: [
    "$firstName",
    {
      $cond: {
        if: {
          $eq: ["$lastName", null],
        },
        then: "",
        else: {
          $concat: [" ", "$lastName"],
        },
      },
    },
  ],
};

exports.fetchAllFriends = ({ Friend, filter, newData, projection }) => {
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
              _id: 0,
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
