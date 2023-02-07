const {
  validate_username,
  validate_email,
  validate_password,
  validate_email_1,
  validate_username_1,
  validate_password_1,
} = require("../validators/generalValidation");

exports.Users = {
  username: {
    type: "string",
    unique: true,
    require: true,
    validation: {
      function: validate_username_1,
    },
  },
  email: {
    type: "string",
    unique: true,
    require: true,
    validation: {
      function: validate_email_1,
    },
  },
  isVerified: {
    type: "bool",
    default: false,
  },
  isBlocked: {
    type: "bool",
    default: false,
  },
  isDeleted: {
    type: "bool",
    default: false,
  },
  password: {
    type: "string",
    require: true,
    validation: {
      function: validate_password_1,
    },
  },
  profilePic: {
    type: "string",
    default: null,
  },
  coverPic: {
    type: "string",
    default: null,
  },
  firstName: {
    type: "string",
    require: true,
  },
  lastName: {
    type: "string",
    default: null,
  },
  bio: {
    type: "string",
    maxLength: 250,
    default: null,
  },
  birthDate: {
    type: Date,
    // require: true,
  },
  gender: {
    type: "string",
    enum: ["male", "female"],
    require: true,
  },
  mobileNumber: {
    type: "number",
    maxLength: 10,
    default: null,
  },
  address: {
    type: "object",
    street: {
      type: "string",
      default: null,
    },
    area: {
      type: "string",
      default: null,
    },
    city: {
      type: "string",
      default: null,
    },
    state: {
      type: "string",
      default: null,
    },
    country: {
      type: "string",
      default: null,
    },
    pincode: {
      type: "string",
      default: null,
    },
  },
  isBlocked: {
    type: "bool",
    default: false,
  },
  isDeleted: {
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
  // Do it later
  // education: {
  //   type: Array,
  // },
  // hobbies: {
  //   type: Array,
  // },
  // socialLinks: {
  //   website: {
  //     type: "string",
  //   },
  //   instagram: {
  //     type: "string",
  //   },
  // },
};
