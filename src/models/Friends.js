exports.Friends = {
  senderId: {
    type: "object",
    require: true,
  },
  receiverId: {
    type: "object",
    require: true,
  },
  requestAccepted: {
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
