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
};
