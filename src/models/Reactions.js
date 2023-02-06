exports.Reactions = {
  type: {
    type: "string",
    enum: ["like", "love", "funny", "sad"],
    require: true,
  },
  postId: {
    type: "object",
    require: true,
  },
  userId: {
    type: "object",
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
