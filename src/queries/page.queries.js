const {
  FullName,
  fetchFullName,
  replaceRootFullname,
} = require("../utils/mongodb_utils");
const { postPagination } = require("../utils/pagination");

exports.createPageQuery = ({ Pages, filter, newData, projection }) =>
  Pages.insertOne(newData);

exports.givePermission = ({ Permissions, filter, newData, projection }) =>
  Permissions.updateOne(filter, newData, projection);

exports.fetchAllPostPublishRequestQuery = ({
  Pages,
  filter,
  newData,
  projection,
}) =>
  Pages.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "Posts",
        localField: "_id",
        foreignField: "pageId",
        pipeline: [
          {
            $match: {
              isApproved: false,
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "createdBy",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    requested_name: FullName,
                  },
                },
              ],
              as: "createdBy",
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  {
                    $arrayElemAt: ["$createdBy", 0],
                  },
                  "$$ROOT",
                ],
              },
            },
          },
          {
            $project: {
              createdBy: 0,
            },
          },
        ],
        as: "posts",
      },
    },
  ]).toArray();

exports.fetchPagesByPageId = ({ Pages, filter, newData, projection }) => {

  return Pages.aggregate([
    { $match: filter },
    { ...fetchFullName("owner", "_id", "pageOwnerName", "pageOwner") },
    { ...replaceRootFullname("pageOwner") },
    {
      $project: {
        pageOwner: 0,
      },
    },
    {
      $lookup: {
        from: "Posts",
        localField: "_id",
        foreignField: "pageId",
        pipeline: [
          {
            $match: {
              privacy: "public",
            },
          },
          {
            $project: {
              pageId: 0,
              isApproved: 0,
            },
          },
          {
            ...fetchFullName("authorId", "_id", "pageAuthorName", "pageAuthor"),
          },
          { ...replaceRootFullname("pageAuthor") },
          {
            $project: {
              pageAuthor: 0,
              authorId: 0,
            },
          },
          {
            $lookup: {
              from: "Comments",
              localField: "_id",
              foreignField: "postId",
              pipeline: [
                {
                  ...fetchFullName("userId", "_id", "fullName", "user"),
                },
                {
                  $project: {
                    // _id: 0,
                    postId: 0,
                    userId: 0,
                  },
                },
                { ...replaceRootFullname("user") },
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
                      { ...fetchFullName("userId", "_id", "fullName", "user") },
                      { ...replaceRootFullname("user") },
                      {
                        $project: {
                          user: 0,
                        },
                      },
                    ],
                    as: "reaction",
                  },
                },
                {
                  $sort: {
                    createdAt: 1,
                  },
                },
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
                {
                  $match: {
                    commentId: null,
                  },
                },
                {
                  $project: {
                    _id: 0,
                    postId: 0,
                    commentId: 0,
                  },
                },
                { ...fetchFullName("userId", "_id", "fullName", "user") },
                { ...replaceRootFullname("user") },
                {
                  $project: {
                    user: 0,
                  },
                },
              ],
              as: "reaction",
            },
          },
        ],
        as: "posts",
      },
    },
  ]).toArray();
};
