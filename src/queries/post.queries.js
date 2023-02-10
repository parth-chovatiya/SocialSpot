const {
  FullName,
  fetchFullName,
  replaceRootFullname,
  sortByLatest,
} = require("../utils/mongodb_utils");
const { postPagination } = require("../utils/pagination");

// Fetch Post with Comments & User info --> in the MongoDB compass aggregation pipeline save name
exports.fetchPublicPostsQuery = ({ Posts, filter, newData, projection }) => {
  const { skip, limit, sort } = postPagination(projection);

  return Posts.aggregate([
    { $match: { isVisible: true } },
    { ...fetchFullName("authorId", "_id") },
    { ...replaceRootFullname },
    { $project: { user: 0 } },
    {
      $lookup: {
        from: "Comments",
        localField: "_id",
        foreignField: "postId",
        pipeline: [
          { ...fetchFullName("userId", "_id") },
          {
            $project: {
              // _id: 0,
              postId: 0,
              userId: 0,
            },
          },
          { ...replaceRootFullname },
          {
            $lookup: {
              from: "Reactions",
              localField: "_id",
              foreignField: "commentId",
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    postId: 0,
                    commentId: 0,
                  },
                },
                { ...fetchFullName("userId", "_id") },
                { ...replaceRootFullname },
                { $project: { user: 0 } },
              ],
              as: "reaction",
            },
          },
          { ...sortByLatest },
          {
            $project: {
              // _id: 0,
              user: 0,
            },
          },
        ],
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "Reactions",
        localField: "_id",
        foreignField: "postId",
        pipeline: [
          { $match: { commentId: null } },
          {
            $project: {
              _id: 0,
              postId: 0,
              commentId: 0,
            },
          },
          { ...fetchFullName("userId", "_id") },
          { ...replaceRootFullname },
          { $project: { user: 0 } },
        ],
        as: "reaction",
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
    { $project: { username: 1 } },
    {
      $lookup: {
        // Find the friends of the User from the 'Friends' table
        // Match the friends from senderId & receiverId
        from: "Friends",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $or: [
                      { $eq: ["$$userId", "$senderId"] },
                      { $eq: ["$$userId", "$receiverId"] },
                    ],
                  },
                  { $eq: ["$requestAccepted", true] },
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
                  if: { $eq: ["$$userId", "$senderId"] },
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
      // Find the pages which user is following from 'Connections' table
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
          { $match: { authorId: { $ne: null } } },
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
                { ...fetchFullName("userId", "_id") },
                {
                  $project: {
                    _id: 0,
                    postId: 0,
                    userId: 0,
                  },
                },
                { ...replaceRootFullname },
                { ...sortByLatest },
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
        // find the post of the each pages
        from: "Posts",
        localField: "pages.pageId",
        foreignField: "pageId",
        pipeline: [
          { $match: { pageId: { $ne: null } } },
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
                { ...fetchFullName("userId", "_id") },
                {
                  $project: {
                    _id: 0,
                    postId: 0,
                    userId: 0,
                  },
                },
                { ...replaceRootFullname },
                { ...sortByLatest },
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
      // do union of the both posts, so that no duplication
      $project: { posts: { $setUnion: ["$postFriends", "$postPages"] } },
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
        newRoot: { $mergeObjects: [{ $arrayElemAt: ["$page", 0] }, "$$ROOT"] },
      },
    },
    {
      $project: {
        page: 0,
        isPause: 0,
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
        newRoot: { $mergeObjects: [{ $arrayElemAt: ["$page", 0] }, "$$ROOT"] },
      },
    },
    {
      $project: {
        page: 0,
        isPaused: 0,
      },
    },
    { $sort: sort },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ]).toArray();
};
