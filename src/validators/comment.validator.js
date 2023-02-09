const { ObjectId } = require("mongodb");
const { getDB } = require("../DB/connectDB");

const { Comments } = require("../models/Comments");
const { sendResponce } = require("../utils/sendResponce");
const { validateInsertData } = require("./validateInsertData");
const { validateUpdateData } = require("./validateUpdateData");

exports.validateInsertComment = async (ctx, next) => {
  try {
    const { postId } = ctx.request.body;

    ctx.request.body.userId = new ObjectId(ctx._id);
    ctx.request.body.postId = new ObjectId(postId);

    const countPosts = await ctx.db
      .collection("Posts")
      .countDocuments({ _id: new ObjectId(postId) });
    ctx.assert(countPosts, 404, "Post not found");

    validateInsertData(ctx.request.body, Comments);

    await next();
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong.",
    });
  }
};

exports.validateUpdateComment = async (ctx, next) => {
  try {
    const commentId = new ObjectId(ctx.params.commentId);

    if (ctx.request.body.parentId) delete ctx.request.body.parentId;
    if (ctx.request.body.userId) delete ctx.request.body.userId;

    const countPosts = await ctx.db.collection("Comments").countDocuments({
      _id: new ObjectId(commentId),
      userId: new ObjectId(ctx._id),
    });
    ctx.assert(countPosts, 404, "Comment not found");

    validateUpdateData(ctx.request.body, Comments);

    await next();
  } catch (error) {
    console.log(error);
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong.",
    });
  }
};

exports.isCommentExists = (commentId) =>
  getDB()
    .collection("Comments")
    .findOne({ _id: new ObjectId(commentId) });
