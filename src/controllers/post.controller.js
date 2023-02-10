const { ObjectId } = require("mongodb");
const {
  fetchPublicPostsQuery,
  fetchPrivatePostsQuery,
  fetchAllMyPostsQuery,
} = require("../queries/post.queries");
const { postPagination } = require("../utils/pagination");
const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/post/createPost
// @desc    Create Post
// @access  Private
exports.createPost = async (ctx) => {
  try {
    console.log(ctx.request.body);
    const post = await ctx.db.collection("Posts").insertOne(ctx.request.body);

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

// @route   PATCH /api/v1/post/updatePost/:postId
// @desc    Update Post
// @access  Private
exports.updatePost = async (ctx) => {
  try {
    const postId = ctx.params.postId;

    const post = await ctx.db
      .collection("Posts")
      .findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $set: { ...ctx.request.body, modifiedAt: new Date() } },
        { returnDocument: "after" }
      );

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Post updated",
      post: post.value,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   DELETE /api/v1/post/deletePost/:postId
// @desc    Delete Post
// @access  Private
exports.deletePost = async (ctx) => {
  try {
    const postId = new ObjectId(ctx.params.postId);

    const post = await ctx.db.collection("Posts").deleteOne({ _id: postId });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Post deleted",
      post: post.value,
    });
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
    const { page, limit, sortBy } = ctx.request.query;

    const post = await fetchPublicPostsQuery({
      Posts,
      projection: { page, limit, sortBy },
    });

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
    const { page, limit, sortBy } = ctx.request.query;

    const post = await fetchPrivatePostsQuery({
      Users,
      filter: { _id: ctx._id },
      projection: { page, limit, sortBy },
    });

    if (!post) {
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
      posts: post,
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
    const Posts = ctx.db.collection("Posts");
    const { page, limit, sort } = postPagination(ctx.request.query);

    const posts = await fetchAllMyPostsQuery({
      Posts: Posts,
      filter: { authorId: ctx._id, isVisible: true },
      projection: { page, limit, sort },
    });

    sendResponce({ ctx, statusCode: 200, message: "Post fetched", posts });
  } catch (error) {
    console.log(error);
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong..",
    });
  }
};

// @route   POST /api/v1/post/search
// @desc    Search post -> description, hashtags
// @access  Public
exports.searchPost = async (ctx) => {
  try {
    let { text = "" } = ctx.request.body;

    const splitText = text.split(" ");
    const searchText = splitText.join("|");

    const posts = await ctx.db
      .collection("Posts")
      .find({
        description: { $regex: new RegExp(searchText), $options: "im" },
        isVisible: true,
        privacy: "public",
      })
      .toArray();

    sendResponce({ ctx, statusCode: 200, posts });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
