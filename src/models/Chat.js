exports.Chats = {
  _id: {
    type: "objectId",
    default: null,
  },
  senderId: {
    type: "objectId",
    require: true,
  },
  receiverId: {
    type: "objectId",
    require: true,
  },
  text: {
    type: "string",
  },
  createdAt: {
    type: "date",
    default: new Date(),
  },
  modifiedAt: {
    type: "date",
    default: new Date(),
  },
};
