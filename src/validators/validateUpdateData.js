exports.validateUpdateData = (data, collection) => {
  if (!data) {
    throw new Error("Please provide data to the validateInsertData.");
  }

  const inputKeys = Object.keys(data);

  for (let key of inputKeys) {
    if (key === "_id") {
      continue;
    }
    const field = collection[key];
    
    console.log(key);
    console.log(field);
    console.log(data[key]);

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

    // check minLength
    if (field.minLength && data[key]?.length < field.minLength) {
      throw new Error(`${key} must be at least ${field.minLength} character`);
    }

    // check maxLength
    if (field.maxLength && data[key]?.length > field.maxLength) {
      throw new Error(`${key} must be at most ${field.maxLength} character`);
    }
  }
};
