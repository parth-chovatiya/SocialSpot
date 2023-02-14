const { ObjectId } = require("bson");
const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/comment/add
// @desc    Add Comment to the post
// @access  Private
exports.addComment = async (ctx) => {
  try {
    const Comments = ctx.db.collection("Comments");
    const comment = await Comments.insertOne(ctx.request.body);
    sendResponce({ ctx, statusCode: 201, message: "Comment Added", comment });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   PATCH /api/v1/comment/update/:commentId
// @desc    Update comment
// @access  Private
exports.updateComment = async (ctx) => {
  try {
    const commentId = new ObjectId(ctx.params.commentId);

    const Comments = ctx.db.collection("Comments");
    const comment = await Comments.findOneAndUpdate(
      { _id: commentId },
      { $set: { ...ctx.request.body, modifiedAt: new Date() } },
      { returnDocument: "after" }
    );

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Comment Updated",
      comment: comment.value,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// @route   DELETE /api/v1/comment/delete/:commentId
// @desc    Delete comment
// @access  Private
exports.deleteComment = async (ctx) => {
  try {
    const commentId = new ObjectId(ctx.params.commentId);
    const comment = await ctx.db
      .collection("Comments")
      .findOneAndDelete({ _id: commentId, userId: ctx._id });

    if (!comment.value) {
      return sendResponce({
        ctx,
        statusCode: 404,
        message: "Comment not found",
      });
    }

    sendResponce({ ctx, statusCode: 200, messaeg: "Comment Deleted" });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   GET /api/v1/comment/my
// @desc    Fetch my comments
// @access  Private
exports.myComment = async (ctx) => {
  try {
    const comment = await ctx.db
      .collection("Comments")
      .find({ userId: ctx._id })
      .toArray();
    sendResponce({
      ctx,
      statusCode: 200,
      message: "Comments Fetched.",
      comment,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
