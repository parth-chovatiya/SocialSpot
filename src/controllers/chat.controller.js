const { ObjectId } = require("mongodb");

const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/chat/saveChat
// @desc    save chat
// @access  Private
exports.saveChat = async (ctx) => {
  try {
    const senderId = new ObjectId(ctx._id);
    const receiverId = new ObjectId(ctx.params.friendId);
    const text = ctx.request.body.text;

    const chatData = {
      senderId,
      receiverId,
      text,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    const chat = await ctx.db.collection("Chats").insertOne(chatData);

    sendResponce({
      ctx,
      statusCode: 201,
      message: "Chat saved.",
      chat,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};

// @route   GET /api/v1/chat/getChat
// @desc    get chat
// @access  Private
exports.fetchChat = async (ctx) => {
  try {
    const friendId = new ObjectId(ctx.params.friendId);
    const _id = new ObjectId(ctx._id);

    const chat = await ctx.db
      .collection("Chats")
      .find({
        $or: [
          { $and: [{ senderId: _id }, { receiverId: friendId }] },
          { $and: [{ senderId: friendId }, { receiverId: _id }] },
        ],
      })
      .toArray();

      console.log(chat)

    sendResponce({
      ctx,
      statusCode: 200,
      message: "Message fetched.",
      chat: chat,
    });
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, message: error.message });
  }
};
