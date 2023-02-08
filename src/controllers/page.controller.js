const { ObjectId } = require("mongodb");

const {
  createPageQuery,
  givePermission,
  fetchAllPostPublishRequestQuery,
} = require("../queries/page.queries");
const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/page/create
// @desc    Create Page
// @access  Private
exports.createPage = async (ctx) => {
  try {
    const Pages = ctx.db.collection("Pages");

    const page = await createPageQuery({ Pages, newData: ctx.request.body });

    sendResponce({ ctx, statusCode: 200, message: "Page created.", page });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/page/givePermission
// @desc    Give Permission to the User of the perticular page
// @access  Private
exports.givePermission = async (ctx) => {
  try {
    const { pageId, userId, role, permissions } = ctx.request.body;

    delete ctx.request.body.role;
    delete ctx.request.body.permissions;

    const storePermissions = await ctx.db.collection("Permissions").updateOne(
      {
        pageId,
        userId,
      },
      {
        $set: ctx.request.body,
        $addToSet: {
          role: { $each: role },
          permissions: { $each: permissions },
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Permission given.",
      permissions,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/page/removePermission
// @desc    Remove Permission to the User of the perticular page
// @access  Private
exports.removePermission = async (ctx) => {
  try {
    const { pageId, userId, role } = ctx.request.body;

    delete ctx.request.body.role;

    const removePermission = await ctx.db.collection("Permissions").updateOne(
      {
        pageId: new ObjectId(pageId),
        userId: new ObjectId(userId),
      },
      { $pull: { role: role } },
      { returnDocument: "after" }
    );

    if (!removePermission.modifiedCount) {
      return sendResponce({
        ctx,
        statusCode: 404,
        message: "You did't given permission to this user.",
      });
    }

    sendResponce({ ctx, statusCode: 200, message: "Permission removed." });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   GET /api/v1/page/myPages
// @desc    Fetch all my pages
// @access  Private
exports.fetchMyPages = async (ctx) => {
  try {
    const pages = await ctx.db
      .collection("Pages")
      .find({ owner: ctx._id })
      .toArray();

    sendResponce({ ctx, statusCode: 200, message: "Paegs fetched.", pages });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   GET /api/v1/page/myPages
// @desc    Fetch all posts which is requested by content creator to post
// @access  Private
exports.fetchAllPostPublishRequest = async (ctx) => {
  try {
    const requests = await fetchAllPostPublishRequestQuery({
      Pages: ctx.db.collection("Pages"),
      filter: {
        owner: ctx._id,
      },
    });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "All request fetched.",
      requests,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   POST /api/v1/page/acceptPostPublishRequests
// @desc    Accept post publish requuest which is requested by content creator to post
// @access  Private
exports.acceptPostPublishRequests = async (ctx) => {
  try {
    const { postId } = ctx.request.body;

    const request = await ctx.db
      .collection("Posts")
      .updateOne(
        { _id: new ObjectId(postId), isVisible: false, authorId: ctx._id },
        { $set: { isVisible: true } }
      );

    if (!request.matchedCount) {
      return sendResponce({ ctx, statusCode: 404, message: "Post not found." });
    }

    sendResponce({ ctx, statusCode: 200, message: "Request Accepted" });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   GET /api/v1/page/followedPages
// @desc    Pages which you are following
// @access  Private
exports.followedPages = async (ctx) => {
  try {
    const pages = await ctx.db
      .collection("Connections")
      .aggregate([
        {
          $match: { userId: ctx._id },
        },
        {
          $lookup: {
            from: "Pages",
            localField: "pageId",
            foreignField: "_id",
            as: "page",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $arrayElemAt: ["$page", 0],
            },
          },
        },
      ])
      .toArray();

    sendResponce({ ctx, statusCode: 200, message: "Pages fetched.", pages });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   GET /api/v1/page/permissionPages
// @desc    Pages in which i have permission to publish post
// @access  Private
exports.permissionPages = async (ctx) => {
  try {
    const pages = await ctx.db
      .collection("Permissions")
      .aggregate([
        {
          $match: { userId: ctx._id },
        },
        {
          $lookup: {
            from: "Pages",
            localField: "pageId",
            foreignField: "_id",
            as: "page",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$page", 0] }, "$$ROOT"],
            },
          },
        },
        {
          $project: { page: 0 },
        },
      ])
      .toArray();

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Pages fetched.",
      profile: { _id: ctx._id },
      pages,
    });
  } catch (error) {
    console.log(error);
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
