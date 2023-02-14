exports.Comments = {
  _id: {
    type: "objectId",
    default: null,
  },
  postId: {
    type: "objectId",
    ref: "Posts",
    require: true,
  },
  userId: {
    type: "objectId",
    ref: "Users",
    require: true,
  },
  commentText: {
    type: "string",
    require: true,
  },
  parentId: {
    type: "objectId",
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
