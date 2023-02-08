const { ObjectId } = require("mongodb");
const { Posts } = require("../models/Posts");
const { sendResponce } = require("../utils/sendResponce");
const { validateInsertData } = require("./validateInsertData");

exports.validateInsertPost = async (ctx, next) => {
  try {
    const { description, type, pageId, imageLinks, videoLinks } =
      ctx.request.body;

    ctx.request.body.authorId = ctx._id;

    // Check if page exists or not & user is owner of that page
    if (pageId) {
      // ctx.assert(0, 400, "You can't create post in the page section.");
      const Page = ctx.db.collection("Pages");
      // const page = await Page.findOne({
      //   _id: new ObjectId(pageId),
      // });

      // page exits -> if owner no need to do anything,
      // check if user has given any role of the page ?

      const Permission = ctx.db.collection("Permissions");

      const page = await Page.aggregate([
        {
          $match: {
            _id: new ObjectId(pageId),
          },
        },
        {
          $lookup: {
            from: "Permissions",
            localField: "_id",
            foreignField: "pageId",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  userId: 1,
                  role: 1,
                },
              },
            ],
            as: "permissions",
          },
        },
      ]).toArray();

      ctx.assert(page.length, 404, "Page not exists.");

      // const doesPermissionHave = page[0].permissions.some(
      //   (permission) =>
      //     String(permission.userId) === String(ctx._id) &&
      //     permission.role.includes("content creator")
      // );

      // if (String(page[0].owner) === String(ctx._id)) {
      //   // owner
      //   ctx.request.body.isVisible = true;
      // } else if (doesPermissionHave) {
      //   // content creator
      //   ctx.request.body.isVisible = false;
      //   ctx.request.body.createdBy = ctx._id;
      //   ctx.request.body.authorId = new ObjectId(page[0].owner);
      // } else {
      //   ctx.assert(
      //     0,
      //     400,
      //     "You didn't have permission to publish post in this page."
      //   );
      // }

      ctx.request.body.pageId = new ObjectId(pageId);

      // is pageId is provided, check if that user is page owner or
    }

    validateInsertData(ctx.request.body, Posts);

    // RegEx to extract hashtags from string
    const regex = new RegExp(/(?<=#)[a-z]+/gim);
    ctx.request.body.hashtags = description?.match(regex) || [];
    ctx.request.body.description = description?.replace(/.#[a-z]+/gm, "");

    // if type is image, then image must be there
    if (type === "image" && !imageLinks) {
      throw new Error("Please upload image");
    }

    // if type is video, then video must be there
    if ((type === "video" || type === "reels") && !videoLinks) {
      throw new Error(`Please upload ${type}`);
    }

    await next();
  } catch (error) {
    console.log(error);
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

exports.validateUpdatePost = async (ctx, next) => {
  try {
    
    await next()
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};
