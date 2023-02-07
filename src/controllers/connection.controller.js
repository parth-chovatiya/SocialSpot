const { ObjectId } = require("mongodb");

const { followPage, unfollowPage } = require("../queries/connection.queries");
const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/connection/followPage
// @desc    Follow this page
// @access  Private
exports.followPage = async (ctx) => {
  try {
    const Connections = ctx.db.collection("Connections");

    const follow = await followPage({
      Connections,
      newData: ctx.request.body,
    });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "You followed page.",
      follow,
    });
  } catch (error) {
    console.log("follow.contoller", error);
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/connection/unfollowPage
// @desc    Unfollow this page
// @access  Private
exports.unfollowPage = async (ctx) => {
  try {
    const Connections = ctx.db.collection("Connections");

    const unfollow = await unfollowPage({
      Connections,
      filter: {
        pageId: new ObjectId(ctx.request.body.pageId),
        userId: new ObjectId(ctx._id),
      },
    });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "You unfollowed page.",
      unfollow,
    });
  } catch (error) {
    console.log("unfollow.contoller", error);
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};
