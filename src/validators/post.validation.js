const { ObjectId } = require("mongodb");

const { getDB } = require("../DB/connectDB");
const { Posts } = require("../models/Posts");
const { sendResponce } = require("../utils/sendResponce");
const { isValidObjectId } = require("../utils/validation_utils");
const { validateInsertData, validateUpdateData } = require("./generalValidation");


exports.validateInsertPost = async (ctx, next) => {
  try {
    const { description, type, pageId, imageLinks, videoLinks } =
      ctx.request.body;

    ctx.request.body.authorId = new ObjectId(ctx._id);
    validateInsertData(ctx.request.body, Posts);
    // Check if page exists or not & user is owner of that page
    if (pageId) {
      const page = await ctx.db
        .collection("Pages")
        .aggregate([
          {
            $match: { _id: new ObjectId(pageId) },
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
        ])
        .toArray();
      ctx.assert(page.length, 404, "Page not exists.");
    }

    // RegEx to extract hashtags from string
    const regex = new RegExp(/(?<=#)[a-z]+/gim);
    ctx.request.body.hashtags = description?.match(regex) || [];
    // ctx.request.body.description = description?.replace(/.#[a-z]+/gm, "");

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
    const postId = ctx.params.postId;
    const { description, type, imageLinks, videoLinks } =
      ctx.request.body;
    ctx.assert(isValidObjectId(postId), 400, "Please enter valid postId");

    validateUpdateData(ctx.request.body, Posts);

    const post = await ctx.db
      .collection("Posts")
      .findOne({ _id: new ObjectId(postId) });
    ctx.assert(post, 404, "Page not found.");
    ctx.assert(post.isApproved, 404, "May be this post is not yet published.");

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
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

exports.isPostExists = (postId) =>
  getDB()
    .collection("Posts")
    .findOne({ _id: new ObjectId(postId) });
