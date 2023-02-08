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

// Fetch Post with Comments & User info --> in the MongoDB compass aggregation pipeline save name
exports.fetchPublicPosts = ({ Posts, filter, newData, projection }) =>
  Posts.aggregate([
    {
      $match: {
        isVisible: true,
      },
    },
    {
      $lookup: {
        from: "Comments",
        localField: "_id",
        foreignField: "postId",
        pipeline: [
          {
            $lookup: {
              from: "Users",
              localField: "userId",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    fullName: FullName,
                    profilePic: 1,
                  },
                },
              ],
              as: "user",
            },
          },
          {
            $project: {
              _id: 0,
              postId: 0,
              userId: 0,
            },
          },
          {
            // To replace the commented user info with the comment it self
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  {
                    $arrayElemAt: ["$user", 0],
                  },
                  "$$ROOT",
                ],
              },
            },
          },
          {
            $sort: {
              createdAt: 1,
            },
          },
          {
            $project: {
              _id: 0,
              user: 0,
            },
          },
        ],
        as: "comments",
      },
    },
  ]).toArray();

// Fetch Private Post
exports.fetchPrivatePosts = ({ Users, filter, newData, projection }) =>
  Users.aggregate([
    {
      // match the user
      $match: filter,
    },
    {
      $project: {
        username: 1,
      },
    },
    {
      $lookup: {
        // Find the friends of the User from the 'Friends' table
        // Match the friends from senderId & receiverId
        from: "Friends",
        let: {
          userId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $or: [
                      {
                        $eq: ["$$userId", "$senderId"],
                      },
                      {
                        $eq: ["$$userId", "$receiverId"],
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
                    $eq: ["$$userId", "$senderId"],
                  },
                  then: "$receiverId",
                  else: "$senderId",
                },
              },
            },
          },
        ],
        localField: "_id",
        foreignField: "senderId",
        as: "friends",
      },
    },
    {
      $lookup: {
        // find the post of the each friends
        from: "Posts",
        localField: "friends.friend",
        foreignField: "authorId",
        pipeline: [
          {
            // find the comments for each post
            $lookup: {
              from: "Comments",
              localField: "_id",
              foreignField: "postId",
              pipeline: [
                {
                  // project only this items from the comments
                  $project: {
                    _id: 0,
                    userId: 1,
                    commentText: 1,
                    parentId: 1,
                    modifiedAt: 1,
                  },
                },
                {
                  // find the users for each comments
                  $lookup: {
                    from: "Users",
                    localField: "userId",
                    foreignField: "_id",
                    pipeline: [
                      {
                        $project: {
                          _id: 0,
                          fullName: FullName,
                          profilePic: 1,
                        },
                      },
                    ],
                    as: "user",
                  },
                },
                {
                  $project: {
                    _id: 0,
                    postId: 0,
                    userId: 0,
                  },
                },
                {
                  // To replace the commented user info with the comment it self
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        {
                          $arrayElemAt: ["$user", 0],
                        },
                        "$$ROOT",
                      ],
                    },
                  },
                },
                {
                  // sort by the createdAt
                  $sort: {
                    createdAt: 1,
                  },
                },
                {
                  $project: {
                    _id: 0,
                    user: 0,
                  },
                },
              ],
              as: "comments",
            },
          },
        ],
        as: "posts",
      },
    },
    {
      $project: {
        _id: 0,
        posts: 1,
      },
    },
  ]).toArray();
