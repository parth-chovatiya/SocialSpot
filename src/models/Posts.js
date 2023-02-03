exports.Posts = {
  description: {
    type: "string",
    maxLength: 250,
  },
  authorId: {
    type: "objectId",
    require: true,
  },
  type: {
    type: "string",
    enum: ["text", "image", "video", "reels"],
  },
  privacy: {
    type: "string",
    enum: ["public", "private"],
  },
  hashtags: {
    type: "array",
  },
};
