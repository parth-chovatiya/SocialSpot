const { ObjectId } = require("mongodb");
const { Posts } = require("../models/Posts");
const { sendResponce } = require("../utils/sendResponce");
const { validateData } = require("./validateData");

exports.validatePost = async (ctx, next) => {
  try {
    const { description, type, pageId, imageLinks, videoLinks } =
      ctx.request.body;

    ctx.request.body.authorId = new ObjectId(ctx._id);
    if (pageId) ctx.request.body.pageId = new ObjectId(pageId);

    validateData(ctx.request.body, Posts);

    // RegEx to extract hashtags from strign
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
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
