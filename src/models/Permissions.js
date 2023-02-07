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
    type: "string", // array
    require: true,
    enum: ["content creator"],
  },
  // permissions: {
  //   type: "array",
  //   default: null,
  // },
  createdAt: {
    type: "date",
    default: new Date(),
  },
  modifiedAt: {
    type: "date",
    default: new Date(),
  },
};
