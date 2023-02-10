exports.Connections = {
  pageId: {
    type: "objectId",
    require: true,
    ref: "Pages",
  },
  userId: {
    type: "objectId",
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
