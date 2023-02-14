exports.Pages = {
  _id: {
    type: "objectId",
    default: null,
  },
  pageName: {
    type: "string",
    require: true,
  },
  pageDesc: {
    type: "string",
    default: null,
  },
  owner: {
    type: "objectId",
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
