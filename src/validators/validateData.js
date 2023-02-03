const { sendResponce } = require("../utils/sendResponce");
const { Users } = require("../models/Users");

exports.validateData = async (ctx, next) => {
  try {
    const data = ctx.request.body;
    const inputKeys = Object.keys(data);

    for (let key in Users) {
      const field = Users[key];
      if (!inputKeys.includes(key) && field.default !== undefined) {
        data[key] = field.default;
        continue;
      }

      // check the required value
      if (field.require && !inputKeys.includes(key)) {
        ctx.assert(0, 400, `${key} is required.`);
      }

      // check the type
      if (inputKeys.includes(key) && typeof data[key] !== field.type) {
        ctx.assert(0, 400, `Enter valid type of ${key}`);
      }

      // check the custom validation, ----> Modified this
      // if (field.validaton && data[key] && field.validaton.function(ctx, next)) {
      //   ctx.assert(0, 400, `Enter valid type of ${key}`);
      // }

      // check enum type data
      // check & convert date type data
      // check object type data
      // check array type data
    }

    console.log("data", data);

    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
