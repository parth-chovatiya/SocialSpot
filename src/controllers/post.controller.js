const { ObjectId } = require("mongodb");
const { sendResponce } = require("../utils/sendResponce");

exports.createPost = async (ctx) => {
  try {
    const body = ctx.request.body;

    body.authorId = new ObjectId(ctx._id);

    const db = ctx.db.collection("Posts");
    const post = await db.insertOne(body);

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Post created.",
      post,
    });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message || "Something went wrong..",
    });
  }
};
