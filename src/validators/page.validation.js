const { ObjectId } = require("mongodb");

const { getDB } = require("../DB/connectDB");
const { Pages } = require("../models/Page");
const { sendResponce } = require("../utils/sendResponce");
const { validateInsertData } = require("./validateInsertData");
const { validateUpdateData } = require("./validateUpdateData");

exports.validateInsertPage = async (ctx, next) => {
  try {
    ctx.request.body.owner = new ObjectId(ctx._id);
    validateInsertData(ctx.request.body, Pages);

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

exports.validateUpdatePage = async (ctx, next) => {
  try {
    const pageId = new ObjectId(ctx.params.pageId);
    validateUpdateData(ctx.request.body, Pages);

    const page = await ctx.db.collection("Pages").findOne({ _id: pageId });

    ctx.assert(page, 404, "Page not found.");
    ctx.assert(
      page.owner.toString() === ctx._id.toString(),
      404,
      "This is not your page."
    );

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

exports.isPageExists = (_id) => getDB().collection("Pages").findOne({ _id });
