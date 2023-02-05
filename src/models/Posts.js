exports.Posts = {
  description: {
    type: "string",
    maxLength: 250,
    default: null,
  },
  authorId: {
    type: "object",
    require: true,
  },
  pageId: {
    type: "object",
    default: null,
  },
  type: {
    type: "string",
    enum: ["text", "image", "video", "reels"],
  },
  imageLinks: {
    // array type
    type: "object",
    default: null,
  },
  videoLinks: {
    // array type
    type: "object",
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
