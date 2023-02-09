const { ObjectId } = require("mongodb");

const { Permissions } = require("../models/Permissions");
const { sendResponce } = require("../utils/sendResponce");
const { isUserExists } = require("./generalValidation");
const { isPageExists } = require("./page.validation");
const { validateInsertData } = require("./validateInsertData");

exports.validatePermission = async (ctx, next) => {
  try {
    let { pageId, userId, role } = ctx.request.body;

    pageId = new ObjectId(pageId);
    userId = new ObjectId(userId);

    ctx.request.body.pageId = pageId;
    ctx.request.body.userId = userId;

    validateInsertData(ctx.request.body, Permissions);

    const page = await isPageExists(pageId); // check id page exists
    const user = await isUserExists(userId); // check it user exits

    ctx.assert(page, 404, "Page not found");
    ctx.assert(user, 404, "User not found.");

    ctx.assert(
      page.owner.toString() === ctx._id.toString(),
      400,
      "You are not allowed to give permission. As this is not your page."
    );
    ctx.assert(
      page.owner.toString() !== userId.toString(),
      400,
      "You are the owner of this page."
    );

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

exports.acceptPostPublishRequestsValidation = async (ctx, next) => {
  try {
    const { postId } = ctx.request.body;

    const post = await ctx.db
      .collection("Posts")
      .aggregate([
        {
          $match: {
            _id: new ObjectId(postId),
          },
        },
        {
          $lookup: {
            from: "Pages",
            localField: "pageId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  pageOwner: "$owner",
                },
              },
            ],
            as: "page",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ["$page", 0],
                },
                "$$ROOT",
              ],
            },
          },
        },
        {
          $project: {
            page: 0,
          },
        },
      ])
      .toArray();

    ctx.assert(post.length, 400, "Post not found.");
    ctx.assert(
      post[0].pageOwner.toString() === ctx._id.toString(),
      400,
      "Only page owner can accept request."
    );

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
