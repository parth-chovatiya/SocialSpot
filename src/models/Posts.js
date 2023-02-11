exports.Posts = {
  description: {
    type: "string",
    maxLength: 250,
    default: null,
  },
  authorId: {
    type: "objectId",
    require: true,
    ref: "Users",
  },
  pageId: {
    type: "objectId",
    default: null,
  },
  type: {
    type: "string",
    enum: ["text", "image", "video", "reels"],
  },
  isApproved: {
    type: "boolean",
    default: true,
  },
  // createdBy: {
  //   type: "objectId",
  //   default: null,  // null -> owner it self
  // },
  imageLinks: {
    // array type
    type: "objectId",
    default: null,
  },
  videoLinks: {
    // array type
    type: "objectId",
    default: null,
  },
  privacy: {
    type: "string",
    enum: ["public", "private"],
    default: "public",
  },
  hashtags: {
    type: "array",
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
