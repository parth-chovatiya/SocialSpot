const { ObjectId } = require("mongodb");

const { sendResponce } = require("../utils/sendResponce");

// Middleware to check the create permission
exports.checkCreatePermission = async (ctx, next) => {
  try {
    const { pageId } = ctx.request.body;

    // If pageId is not there, do operations in the profile page
    if (!pageId) {
      return await next();
    }

    const permission = await ctx.db.collection("Permissions").findOne({
      pageId: new ObjectId(pageId),
      userId: new ObjectId(ctx._id),
    });

    if (!permission?.permissions?.includes("create")) {
      return sendResponce({
        ctx,
        statusCode: 400,
        message: "You didn't have permission to create post.",
      });
    }

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// Middleware to check the update permission
exports.checkUpdatePermission = async (ctx, next) => {
  try {
    const { pageId } = ctx.request.body;

    if (!pageId) {
      return await next();
    }

    const permission = await ctx.db.collection("Permissions").findOne({
      pageId: new ObjectId(pageId),
      userId: new ObjectId(ctx._id),
    });

    if (!permission?.permissions?.includes("update")) {
      return sendResponce({
        ctx,
        statusCode: 400,
        message: "You didn't have permission to create post.",
      });
    }

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// Middleware to check the delete permission
exports.checkDeletePermission = async (ctx, next) => {
  try {
    const { pageId } = ctx.request.body;

    if (!pageId) {
      return await next();
    }

    const permission = await ctx.db.collection("Permissions").findOne({
      pageId: new ObjectId(pageId),
      userId: new ObjectId(ctx._id),
    });

    if (!permission?.permissions?.includes("delete")) {
      return sendResponce({
        ctx,
        statusCode: 400,
        message: "You didn't have permission to create post.",
      });
    }

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// send post publish request
exports.sendPostPublishRequest = async (ctx, next) => {
  try {
    const { pageId } = ctx.request.body;

    if (pageId) {
      ctx.request.body.isVisible = false;
      ctx.request.body.authorId = ctx._id;
      ctx.request.body.pageId = new ObjectId(pageId);
    }

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
