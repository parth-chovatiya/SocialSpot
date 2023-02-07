exports.Connections = {
  pageId: {
    type: "object",
    require: true,
    ref: "Pages",
  },
  userId: {
    type: "object",
    require: true,
    ref: "Users",
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
