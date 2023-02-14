const { ObjectId } = require("mongodb");

const { Connections } = require("../models/Connections");
const { sendResponce } = require("../utils/sendResponce");
const { isValidObjectId } = require("../utils/validation_utils");
const { validateInsertData } = require("./generalValidation");

exports.validateConnection = async (ctx, next) => {
  try {
    let { pageId } = ctx.params;
    if (!isValidObjectId(pageId)) {
      throw new Error("Enter valid pageId.");
    }

    ctx.request.body.pageId = new ObjectId(pageId);
    ctx.request.body.userId = new ObjectId(ctx._id);

    validateInsertData(ctx.request.body, Connections);

    // Check if user already followed this page
    const isExists = await ctx.db.collection("Connections").countDocuments({
      $and: [
        { userId: ctx.request.body.userId },
        { pageId: new ObjectId(pageId) },
      ],
    });
    ctx.assert(!isExists, 400, "You already follow this page.");

    // Check if Page exists
    const countPages = await ctx.db.collection("Pages").countDocuments({
      _id: new ObjectId(pageId),
    });
    ctx.assert(countPages, 404, "Page not found");

    await next();
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

exports.checkConnectionExists = async (ctx, next) => {
  try {
    const { pageId } = ctx.params;

    if (!isValidObjectId(pageId)) {
      throw new Error("Enter valid pageId");
    }

    const countConnection = await ctx.db
      .collection("Connections")
      .countDocuments({
        pageId: new ObjectId(pageId),
        userId: new ObjectId(ctx._id),
      });
    ctx.assert(countConnection, 404, "You are not following to this page.");

    await next();
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong.",
    });
  }
};
