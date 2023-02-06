const { ObjectId } = require("mongodb");
const {
  fetchPublicPosts,
  fetchPrivatePosts,
} = require("../queries/post.queries");

const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/post/create
// @desc    Create Post
// @access  Private
exports.createPost = async (ctx) => {
  try {
    const body = ctx.request.body;

    const db = ctx.db.collection("Posts");
    const post = await db.insertOne(body);

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Post created.",
      post,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong..",
    });
  }
};

// @route   POST /api/v1/post/fetchPublic
// @desc    Fetch all public posts
// @access  Public
exports.fetchAllPublicPosts = async (ctx) => {
  try {
    const Post = ctx.db.collection("Posts");

    // To merge the firstName with lastName
    // const FullName = {
    //   $concat: [
    //     "$firstName",
    //     {
    //       $cond: {
    //         if: {
    //           $eq: ["$lastName", null],
    //         },
    //         then: "",
    //         else: {
    //           $concat: [" ", "$lastName"],
    //         },
    //       },
    //     },
    //   ],
    // };

    // Fetch Post with Comments & User info --> in the MongoDB compass aggregation pipeline save name
    // const post = await Post.aggregate([
    //   {
    //     $lookup: {
    //       from: "Comments",
    //       localField: "_id",
    //       foreignField: "postId",
    //       pipeline: [
    //         {
    //           $lookup: {
    //             from: "Users",
    //             localField: "userId",
    //             foreignField: "_id",
    //             pipeline: [
    //               {
    //                 $project: {
    //                   _id: 0,
    //                   fullName: FullName,
    //                   profilePic: 1,
    //                 },
    //               },
    //             ],
    //             as: "user",
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             postId: 0,
    //             userId: 0,
    //           },
    //         },
    //         {
    //           // To replace the commented user info with the comment it self
    //           $replaceRoot: {
    //             newRoot: {
    //               $mergeObjects: [
    //                 {
    //                   $arrayElemAt: ["$user", 0],
    //                 },
    //                 "$$ROOT",
    //               ],
    //             },
    //           },
    //         },
    //         {
    //           $sort: {
    //             createdAt: 1,
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             user: 0,
    //           },
    //         },
    //       ],
    //       as: "comments",
    //     },
    //   },
    // ]).toArray();

    const post = await fetchPublicPosts({ Post });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Post fetched.",
      post,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong..",
    });
  }
};

// @route   POST /api/v1/post/fetchPrivate
// @desc    Fetch all private posts
// @access  Private
exports.fetchAllPrivatePosts = async (ctx) => {
  try {
    const User = ctx.db.collection("Users");
    const _id = new ObjectId(ctx._id);

    // To merge the firstName with lastName
    // const FullName = {
    //   $concat: [
    //     "$firstName",
    //     {
    //       $cond: {
    //         if: {
    //           $eq: ["$lastName", null],
    //         },
    //         then: "",
    //         else: {
    //           $concat: [" ", "$lastName"],
    //         },
    //       },
    //     },
    //   ],
    // };

    // const post = await User.aggregate([
    //   {
    //     $match: {
    //       _id: _id,
    //     },
    //   },
    //   {
    //     $project: {
    //       username: 1,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "Friends",
    //       let: {
    //         userId: "$_id",
    //       },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 {
    //                   $or: [
    //                     {
    //                       $eq: ["$$userId", "$senderId"],
    //                     },
    //                     {
    //                       $eq: ["$$userId", "$receiverId"],
    //                     },
    //                   ],
    //                 },
    //                 {
    //                   $eq: ["$requestAccepted", true],
    //                 },
    //               ],
    //             },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             friend: {
    //               $cond: {
    //                 if: {
    //                   $eq: ["$$userId", "$senderId"],
    //                 },
    //                 then: "$receiverId",
    //                 else: "$senderId",
    //               },
    //             },
    //           },
    //         },
    //       ],
    //       localField: "_id",
    //       foreignField: "senderId",
    //       as: "friends",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "Posts",
    //       localField: "friends.friend",
    //       foreignField: "authorId",
    //       pipeline: [
    //         {
    //           $lookup: {
    //             from: "Comments",
    //             localField: "_id",
    //             foreignField: "postId",
    //             pipeline: [
    //               {
    //                 $project: {
    //                   _id: 0,
    //                   userId: 1,
    //                   commentText: 1,
    //                   parentId: 1,
    //                   modifiedAt: 1,
    //                 },
    //               },
    //               {
    //                 $lookup: {
    //                   from: "Users",
    //                   localField: "userId",
    //                   foreignField: "_id",
    //                   pipeline: [
    //                     {
    //                       $project: {
    //                         _id: 0,
    //                         fullName: FullName,
    //                         profilePic: 1,
    //                       },
    //                     },
    //                   ],
    //                   as: "user",
    //                 },
    //               },
    //               {
    //                 $project: {
    //                   _id: 0,
    //                   postId: 0,
    //                   userId: 0,
    //                 },
    //               },
    //               {
    //                 // To replace the commented user info with the comment it self
    //                 $replaceRoot: {
    //                   newRoot: {
    //                     $mergeObjects: [
    //                       {
    //                         $arrayElemAt: ["$user", 0],
    //                       },
    //                       "$$ROOT",
    //                     ],
    //                   },
    //                 },
    //               },
    //               {
    //                 $sort: {
    //                   createdAt: 1,
    //                 },
    //               },
    //               {
    //                 $project: {
    //                   _id: 0,
    //                   user: 0,
    //                 },
    //               },
    //             ],
    //             as: "comments",
    //           },
    //         },
    //       ],
    //       as: "posts",
    //     },
    //   },
    // ]).toArray();

    const post = await fetchPrivatePosts({ User, filter: { _id: _id } });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Post fetched.",
      post: post[0].posts,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong..",
    });
  }
};
