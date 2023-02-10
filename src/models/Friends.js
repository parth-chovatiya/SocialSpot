exports.Friends = {
  senderId: {
    type: "objectId",
    require: true,
  },
  receiverId: {
    type: "objectId",
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
