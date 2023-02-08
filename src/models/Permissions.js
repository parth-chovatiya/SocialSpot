exports.Permissions = {
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
  role: {
    type: "object", // array
    require: true,
    enum: ["content creator"],
  },
  permissions: {
    type: "object",
    enum: ["create", "read", "update", "delete"],
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
