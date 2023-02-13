const { ObjectId } = require("mongodb");

const { followPage, unfollowPage } = require("../queries/connection.queries");
const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/connection/followPage/:pageId
// @desc    Follow this page
// @access  Private
exports.followPage = async (ctx) => {
  try {
    const follow = await followPage({
      Connections: ctx.db.collection("Connections"),
      newData: ctx.request.body,
    });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "You are now following this page.",
      follow,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/connection/unfollowPage/:pageId
// @desc    Unfollow this page
// @access  Private
exports.unfollowPage = async (ctx) => {
  try {
    const { pageId } = ctx.params;
    const unfollow = await unfollowPage({
      Connections: ctx.db.collection("Connections"),
      filter: {
        pageId: new ObjectId(pageId),
        userId: new ObjectId(ctx._id),
      },
    });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "You unfollowed this page.",
      unfollow,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};
