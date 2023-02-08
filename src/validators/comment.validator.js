const { ObjectId } = require("mongodb");

const { Comments } = require("../models/Comments");
const { sendResponce } = require("../utils/sendResponce");
const { validateData } = require("./validateData");

exports.validateComment = async (ctx, next) => {
  try {
    const { postId } = ctx.request.body;

    ctx.request.body.userId = new ObjectId(ctx._id);
    ctx.request.body.postId = new ObjectId(postId);

    const countPosts = await ctx.db
      .collection("Posts")
      .countDocuments({ _id: new ObjectId(postId) });
    ctx.assert(countPosts, 404, "Post not found");

    validateData(ctx.request.body, Comments);

    await next();
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong.",
    });
  }
};
