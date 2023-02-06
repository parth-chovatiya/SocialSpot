exports.Comments = {
  postId: {
    type: "object",
    ref: "Posts",
    require: true,
  },
  userId: {
    type: "object",
    ref: "Users",
    require: true,
  },
  commentText: {
    type: "string",
    require: true,
  },
  parentId: {
    type: "object",
    default: null,
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
