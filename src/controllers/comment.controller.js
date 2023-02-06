const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/comment/add
// @desc    Add Comment to the post
// @access  Private
exports.addComment = async (ctx) => {
  try {
    const Comments = ctx.db.collection("Comments");
    const comment = await Comments.insertOne(ctx.request.body);
    sendResponce({ ctx, statusCode: 200, message: "Comment Added" });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
