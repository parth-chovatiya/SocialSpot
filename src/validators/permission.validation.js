const { ObjectId } = require("mongodb");

const { Permissions } = require("../models/Permissions");
const { sendResponce } = require("../utils/sendResponce");
const { isUserExists } = require("./generalValidation");
const { isPageExists } = require("./page.validation");
const { validateData } = require("./validateData");

exports.validatePermission = async (ctx, next) => {
  try {
    let { pageId, userId, role } = ctx.request.body;

    pageId = new ObjectId(pageId);
    userId = new ObjectId(userId);

    ctx.request.body.pageId = pageId;
    ctx.request.body.userId = userId;

    validateData(ctx.request.body, Permissions);

    const page = await isPageExists(pageId); // check id page exists
    const user = await isUserExists(userId); // check it user exits

    ctx.assert(page, 404, "Page not found");
    ctx.assert(user, 404, "User not found.");

    ctx.assert(
      String(page.owner) === String(ctx._id),
      400,
      "You are not allowed to give permission. As this is not your page."
    );

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
