const { ObjectId } = require("mongodb");
const { getDB } = require("../DB/connectDB");

const { Pages } = require("../models/Page");
const { sendResponce } = require("../utils/sendResponce");
const { validateData } = require("./validateData");

exports.validatePage = async (ctx, next) => {
  try {
    ctx.request.body.owner = new ObjectId(ctx._id);

    validateData(ctx.request.body, Pages);

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

exports.isPageExists = (_id) => getDB().collection("Pages").findOne({ _id });
