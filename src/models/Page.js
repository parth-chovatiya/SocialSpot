exports.Pages = {
  pageName: {
    type: "string",
    require: true,
  },
  pageDesc: {
    type: "string",
    default: null,
  },
  owner: {
    type: "object",
    require: true,
  },
  profilePic: {
    type: "string",
    default: null,
  },
  coverPic: {
    type: "string",
    default: null,
  },
  isPaused: {
    type: "bool",
    default: false,
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
