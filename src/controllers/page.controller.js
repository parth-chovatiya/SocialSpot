const { ObjectId } = require("mongodb");

const {
  createPageQuery,
  givePermission,
  fetchAllPostPublishRequestQuery,
  fetchPagesByPageId,
} = require("../queries/page.queries");
const { FullName } = require("../utils/mongodb_utils");
const { sendResponce } = require("../utils/sendResponce");
const { isValidObjectId } = require("../utils/validation_utils");

// @route   POST /api/v1/page/create
// @desc    Create Page
// @access  Private
exports.createPage = async (ctx) => {
  try {
    const page = await createPageQuery({
      Pages: ctx.db.collection("Pages"),
      newData: ctx.request.body,
    });

    sendResponce({ ctx, statusCode: 201, message: "Page created.", page });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   PATCH /api/v1/page/update/:pageId
// @desc    Update Page
// @access  Private
exports.updatePage = async (ctx) => {
  try {
    const pageId = ctx.params.pageId;
    ctx.assert(pageId, 400, "Please provide pageId.");

    const page = await ctx.db
      .collection("Pages")
      .findOneAndUpdate(
        { _id: new ObjectId(pageId) },
        { $set: { ...ctx.request.body, modifiedAt: new Date() } },
        { returnDocument: "after" }
      );

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Page updated.",
      updatedPage: page.value,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   DELETE /api/v1/page/delete/:pageId
// @desc    Delete Page
// @access  Private
exports.deletePage = async (ctx) => {
  try {
    const pageId = ctx.params.pageId;
    ctx.assert(pageId, 400, "Please provide pageId.");

    const page = await ctx.db.collection("Pages").findOneAndDelete({
      _id: new ObjectId(pageId),
      owner: new ObjectId(ctx._id),
    });

    if (!page.value) {
      return sendResponce({
        ctx,
        statusCode: 400,
        message: "May be you are not owner of this page.",
      });
    }

    sendResponce({ ctx, statusCode: 200, message: "Page deleted.", page });
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
        pageId: new ObjectId(pageId),
        userId: new ObjectId(userId),
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
    const { pageId, userId, role, permission } = ctx.request.body;

    delete ctx.request.body.role;

    const removePermission = await ctx.db.collection("Permissions").updateOne(
      {
        pageId: new ObjectId(pageId),
        userId: new ObjectId(userId),
      },
      { $pull: { role: role, permissions: permission } },
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

// @route   GET /api/v1/page/user/:pageId
// @desc    Fetch all my pages
// @access  Private
exports.fetchUsersPages = async (ctx) => {
  try {
    let userId = ctx.params.userId;
    if (userId === "my") userId = ctx._id;
    ctx.assert(isValidObjectId(userId.toString()), 400, "Enter valid userId.");

    const user = await ctx.db.collection("Users").findOne(
      { _id: new ObjectId(userId), isVerified: true },
      {
        projection: {
          fullName: FullName,
          email: 1,
          gender: 1,
        },
      }
    );
    ctx.assert(user, 404, "User not found.");

    const pages = await ctx.db
      .collection("Pages")
      .find({ owner: new ObjectId(userId), isPaused: false })
      .toArray();

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Page fetched.",
      user,
      pages,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

exports.fetchPage = async (ctx) => {
  try {
    let { pageId } = ctx.params;

    ctx.assert(isValidObjectId(pageId), 400, "Enter valid pageId");

    const pages = await fetchPagesByPageId({
      Pages: ctx.db.collection("Pages"),
      filter: { _id: new ObjectId(pageId) },
    });

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Page fetched.",
      page: pages,
    });
  } catch (error) {
    console.log(error);
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
      filter: { owner: ctx._id },
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
        { _id: new ObjectId(postId), isApproved: false },
        { $set: { isApproved: true } }
      );

    if (!request.matchedCount) {
      return sendResponce({
        ctx,
        statusCode: 404,
        message: "You already accepted post publish request.",
      });
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
        { $match: { userId: ctx._id } },
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
            newRoot: { $arrayElemAt: ["$page", 0] },
          },
        },
      ])
      .toArray();

    sendResponce({ ctx, statusCode: 200, message: "Pages fetched.", pages });
  } catch (error) {
    console.log(error);
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

// @route   POST /api/v1/page/search
// @desc    Search page -> pageName, pageDesc
// @access  Public
exports.searchPages = async (ctx) => {
  try {
    const { text = "" } = ctx.request.body;

    const splitText = text.split(" ");
    const searchText = splitText.join("|");

    const pages = await ctx.db
      .collection("Pages")
      .find({
        $or: [
          { pageName: { $regex: new RegExp(searchText), $options: "im" } },
          { pageDesc: { $regex: new RegExp(searchText), $options: "im" } },
        ],
      })
      .project({ _id: 0 })
      .toArray();

    sendResponce({ ctx, statusCode: 200, message: "Pages fetched.", pages });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
