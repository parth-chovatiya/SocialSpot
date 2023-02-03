const jwt = require("jsonwebtoken");
const { sendResponce } = require("../utils/sendResponce");
const { verifyToken } = require("../utils/token");

exports.checkAuth = async (ctx, next) => {
  try {
    const token = ctx.header.authorization?.split(" ")[1];

    ctx.assert(token, 400, "Please, Login again.");

    const decoded = verifyToken(token);

    ctx._id = decoded._id;

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
