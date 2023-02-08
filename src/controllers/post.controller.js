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
    const db = ctx.db.collection("Posts");
    const post = await db.insertOne(ctx.request.body);

    if (!ctx.request.body.isVisible) {
      return sendResponce({
        ctx,
        statusCode: 200,
        message: "Request sended to the owner of the page.",
        post,
      });
    }

    sendResponce({
      ctx,
      statusCode: 201,
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

exports.updatePost = async (ctx) => {
  try {
    const post = await ctx.db.collection("Posts").findOneAndUpdate({
      
    })
    sendResponce({ ctx, statusCode: 200, message: "Post updated", post });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   POST /api/v1/post/fetchPublic
// @desc    Fetch all public posts
// @access  Public
exports.fetchAllPublicPosts = async (ctx) => {
  try {
    const Posts = ctx.db.collection("Posts");
    const post = await fetchPublicPosts({ Posts });

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
    const Users = ctx.db.collection("Users");
    const post = await fetchPrivatePosts({
      Users,
      filter: { _id: ctx._id, isVisible: true },
    });

    if (!post.length) {
      return sendResponce({
        ctx,
        statusCode: 200,
        message: "Post fetched.",
        post: [],
      });
    }

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

// @route   GET /api/v1/post/myPosts
// @desc    Fetch all My Posts
// @access  Private
exports.fetchAllMyPosts = async (ctx) => {
  try {
    const posts = await ctx.db
      .collection("Posts")
      .aggregate([
        {
          $match: {
            authorId: ctx._id,
            isVisible: true,
          },
        },
        {
          $group: {
            _id: "$pageId",
            post: {
              $push: "$$ROOT",
            },
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
              $mergeObjects: [
                {
                  $arrayElemAt: ["$page", 0],
                },
                "$$ROOT",
              ],
            },
          },
        },
        {
          $project: {
            page: 0,
          },
        },
      ])
      .toArray();

    sendResponce({ ctx, statusCode: 200, message: "Post fetched", posts });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong..",
    });
  }
};
