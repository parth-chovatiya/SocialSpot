const { ObjectId } = require("mongodb");

const { isValidObjectId } = require("../utils/validation_utils");

exports.validateUpdateData = (data, collection) => {
  if (!data) throw new Error("Please provide data to the validateInsertData.");

  const inputKeys = Object.keys(data);
  for (let key of inputKeys) {
    if (key === "_id") continue;

    const field = collection[key];
    if (!field) throw new Error("Please provide valid key.");

    console.log(key);
    console.log(field);
    console.log(data[key]);

    if (field.type === "objectId") {
      if (!isValidObjectId(data[key].toString()))
        throw new Error(`Enter valid type of objectId in ${key}`);
      data[key] = new ObjectId(data[key]);
      continue;
    }

    // check the type
    if (inputKeys.includes(key) && typeof data[key] !== field.type)
      throw new Error(`Enter valid type of ${key}`);

    // check enum type data
    if (
      typeof data[key] === "string" &&
      field.enum &&
      !field.enum.includes(data[key])
    ) {
      throw new Error(`${key} must be one of this: ${field.enum}`);
    }

    // check minLength
    if (field.minLength && data[key]?.length < field.minLength)
      throw new Error(`${key} must be at least ${field.minLength} character`);

    // check maxLength
    if (field.maxLength && data[key]?.length > field.maxLength)
      throw new Error(`${key} must be at most ${field.maxLength} character`);
  }
};
