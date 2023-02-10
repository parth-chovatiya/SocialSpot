const { ObjectId } = require("mongodb");

const { isValidObjectId } = require("../utils/validation_utils");

// To validate the user provided data
exports.validateInsertData = (data, collection) => {
  if (!data) {
    throw new Error("Please provide data to the validateInsertData.");
  }

  const inputKeys = Object.keys(data);

  for (let key in collection) {
    const field = collection[key];

    // put a default value if data not provided
    if (!inputKeys.includes(key) && field.default !== undefined) {
      data[key] = field.default;
      continue;
    }

    // console.log(key, field, typeof data[key], data[key], field.type);

    // check the required value
    if (field.require && !inputKeys.includes(key)) {
      throw new Error(`${key} is required.`);
    }

    // type -> objectId validation
    if (field.type === "objectId") {
      if (!isValidObjectId(data[key].toString()))
        throw new Error(`Enter valid type of objectId in ${key}`);
      data[key] = new ObjectId(data[key]);
      continue;
    }

    // type date -> validation
    if (field.type === "date") {
      if (data[key] instanceof Date) continue;
      throw new Error(`Enter valid type of date in ${key}`);
    }

    // check the type
    if (inputKeys.includes(key) && typeof data[key] !== field.type) {
      throw new Error(`Enter valid type of ${key}`);
    }

    // check enum type data
    if (
      typeof data[key] === "string" &&
      field.enum &&
      !field.enum.includes(data[key])
    ) {
      throw new Error(`${key} must be one of this: ${field.enum}`);
    }

    // if type object(array) and value must be from enum
    if (typeof data[key] === "object" && field.enum) {
      const every = data[key].every((fld) => field.enum.includes(fld));

      if (!every) {
        throw new Error(`${key} must be one of this: ${field.enum}`);
      }
    }

    // check minLength
    if (field.minLength && data[key]?.length < field.minLength) {
      throw new Error(`${key} must be at least ${field.minLength} character`);
    }

    // check maxLength
    if (field.maxLength && data[key]?.length > field.maxLength) {
      throw new Error(`${key} must be at most ${field.maxLength} character`);
    }

    // check the ref
    // if(field.ref && )

    if (
      field.validation &&
      data[key] &&
      !field.validation?.function(data[key])
    ) {
      throw new Error(`Enter proper value for ${key}.`);
    }

    // check array type data
  }
};
