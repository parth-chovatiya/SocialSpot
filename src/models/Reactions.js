exports.Reactions = {
  type: {
    type: "string",
    enum: ["like", "love", "funny", "sad"],
    require: true,
  },
  postId: {
    type: "objectId",
    require: true,
  },
  commentId: {
    type: "objectId",
    default: null,
  },
  userId: {
    type: "objectId",
    require: true,
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
