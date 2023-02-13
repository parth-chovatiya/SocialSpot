const { ObjectId } = require("bson");
const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/reaction/like
// @desc    Like page or comment
// @access  Private
exports.like = async (ctx) => {
  try {
    const { postId, commentId } = ctx.request.body;

    const findLike = {
      postId: new ObjectId(postId),
      userId: new ObjectId(ctx._id),
    };
    if (commentId) findLike.commentId = new ObjectId(commentId);
    else findLike.commentId = null;

    const reaction = await ctx.db
      .collection("Reactions")
      .findOneAndUpdate(
        findLike,
        { $set: ctx.request.body },
        { returnDocuments: "after", upsert: true }
      );

    console.log(ctx.request.body);
    sendResponce({
      ctx,
      statusCode: 201,
      message: "Reaction saved",
      reaction: reaction.value,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   POST /api/v1/reaction/unlike
// @desc    Unlike page or comment
// @access  Private
exports.unlike = async (ctx) => {
  try {
    const { postId, commentId } = ctx.request.body;

    const findLike = {
      postId: new ObjectId(postId),
      userId: new ObjectId(ctx._id),
    };
    if (commentId) findLike.commentId = new ObjectId(commentId);
    else findLike.commentId = null;

    const reaction = await ctx.db
      .collection("Reactions")
      .findOneAndDelete(findLike);

    if (!reaction.value) {
      return sendResponce({
        ctx,
        statusCode: 404,
        message: "Didn't find any reaction",
      });
    }
    sendResponce({
      ctx,
      statusCode: 200,
      message: "Reaction deleted",
      reaction: reaction.value,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
