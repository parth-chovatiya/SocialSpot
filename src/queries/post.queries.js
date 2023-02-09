const { postPagination } = require("../utils/pagination");

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
exports.fetchPublicPostsQuery = ({ Posts, filter, newData, projection }) => {
  const { skip, limit, sort } = postPagination(projection);

  return Posts.aggregate([
    { $match: { isVisible: true } },
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
    { $sort: sort },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ]).toArray();
};

// Fetch Private Post based on the their friends & following pages
exports.fetchPrivatePostsQuery = ({ Users, filter, newData, projection }) => {
  const { skip, limit, sort } = postPagination(projection);
  return Users.aggregate([
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
        as: "friends",
      },
    },
    {
      $lookup: {
        from: "Connections",
        localField: "_id",
        foreignField: "userId",
        pipeline: [
          {
            $project: {
              _id: 0,
              pageId: 1,
            },
          },
        ],
        as: "pages",
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
        as: "postFriends",
      },
    },
    {
      $lookup: {
        // find the post of the each friends
        from: "Posts",
        localField: "pages.pageId",
        foreignField: "pageId",
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
        as: "postPages",
      },
    },
    {
      $project: {
        posts: {
          $setUnion: ["$postFriends", "$postPages"],
        },
      },
    },
    {
      $project: {
        _id: 0,
        posts: 1,
      },
    },
    { $unwind: "$posts" },
    {
      $match: {
        "posts.isVisible": true,
        "posts.authorId": { $ne: filter._id },
      },
    },
    { $sort: sort },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ]).toArray();
};

// Fetch all the post which is posted by perticular user
// filter -> userId
exports.fetchAllMyPostsQuery = ({ Posts, filter, newData, projection }) => {
  const { skip, limit, sort } = postPagination(projection);
  return Posts.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$pageId",
        post: { $push: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "Pages",
        localField: "_id",
        foreignField: "_id",
        as: "page",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$page", 0] }, "$$ROOT"],
        },
      },
    },
    {
      $project: { page: 0 },
    },
    { $sort: sort },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ]).toArray();
};
