const { ObjectId } = require("bson");

const { Reactions } = require("../models/Reactions");
const { sendResponce } = require("../utils/sendResponce");
const { isValidObjectId } = require("../utils/validation_utils");
const { isPostExists } = require("./post.validation");
const { validateInsertData } = require("./validateInsertData");

exports.validateLike = async (ctx, next) => {
  try {
    const { type, postId, commentId } = ctx.request.body;

    ctx.request.body.userId = new ObjectId(ctx._id);
    validateInsertData(ctx.request.body, Reactions);

    const post = await isPostExists(postId);
    ctx.assert(post, 404, "Post not found!");

    if (commentId) {
      // check if the comment is the part of the same postId
      const comment = await ctx.db
        .collection("Posts")
        .aggregate([
          { $match: { _id: new ObjectId(postId) } },
          {
            $lookup: {
              from: "Comments",
              localField: "_id",
              foreignField: "postId",
              pipeline: [{ $match: { _id: new ObjectId(commentId) } }],
              as: "comments",
            },
          },
          { $project: { comments: 1 } },
        ])
        .toArray();

      ctx.assert(
        comment.length && comment[0]?.comments?.length,
        404,
        "Comment not found!"
      );
    }

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
