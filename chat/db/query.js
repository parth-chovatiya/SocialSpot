// const API = "http://localhost:8080/api/v1";

const { ObjectId } = require("mongodb");
const { getDB } = require("./connectDB");

const save_chat = async ({ text, to, from }) => {
  const db = await getDB();
  const chat = await db.collection("Chats").insertOne({
    senderId: new ObjectId(from),
    receiverId: new ObjectId(to),
    text: text,
    createdAt: new Date(),
    modifiedAt: new Date(),
  });
  console.log(chat);
};
module.exports = save_chat;
