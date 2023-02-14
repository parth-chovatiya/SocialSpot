const { ObjectId } = require("mongodb");
const { getDB } = require("../DB/connectDB");

const { Comments } = require("../models/Comments");
const { sendResponce } = require("../utils/sendResponce");
const { isValidObjectId } = require("../utils/validation_utils");
const {
  validateInsertData,
  validateUpdateData,
} = require("./generalValidation");

exports.validateInsertComment = async (ctx, next) => {
  try {
    const { postId, parentId } = ctx.request.body;

    ctx.request.body.userId = new ObjectId(ctx._id);
    validateInsertData(ctx.request.body, Comments);

    if (parentId) {
      ctx.request.body.parentId = new ObjectId(parentId);

      const countPosts = await ctx.db.collection("Comments").countDocuments({
        _id: new ObjectId(parentId),
        postId: new ObjectId(postId),
      });
      ctx.assert(countPosts, 404, "Comment not found");
    }

    const countPosts = await ctx.db
      .collection("Posts")
      .countDocuments({ _id: new ObjectId(postId) });
    ctx.assert(countPosts, 404, "Post not found");

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
    const { commentId } = ctx.params;

    ctx.assert(isValidObjectId(commentId), 400, "Enter valid commentId.");

    if (ctx.request.body.postId) delete ctx.request.body.postId;
    if (ctx.request.body.parentId) delete ctx.request.body.parentId;
    if (ctx.request.body.userId) delete ctx.request.body.userId;

    validateUpdateData(ctx.request.body, Comments);

    // check is comment exists with commentId & userId
    const countPosts = await ctx.db.collection("Comments").countDocuments({
      _id: new ObjectId(commentId),
      userId: new ObjectId(ctx._id),
    });
    ctx.assert(countPosts, 404, "Comment not found");

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

// exports.isCommentExists = async (commentId) =>
//   (await getDB())
//     .collection("Comments")
//     .findOne({ _id: new ObjectId(commentId) });
