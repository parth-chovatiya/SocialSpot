// To validate the user provided data
exports.validateData = (data, collection) => {
  const inputKeys = Object.keys(data);

  for (let key in collection) {
    const field = collection[key];

    console.log(key, field, typeof data[key], field.type);

    // put a default value if data not provided
    if (!inputKeys.includes(key) && field.default !== undefined) {
      data[key] = field.default;
      continue;
    }

    // check the required value
    if (field.require && !inputKeys.includes(key)) {
      throw new Error(`${key} is required.`);
    }

    // check the type
    if (inputKeys.includes(key) && typeof data[key] !== field.type) {
      throw new Error(`Enter valid type of ${key}`);
    }

    // check enum type data
    if (field.enum && !field.enum.includes(data[key])) {
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

    // check the ref
    // if(field.ref && )

    // check the custom validation, ----> Modified this
    // if (field.validaton && data[key] && field.validaton.function(ctx, next)) {
    // throw new Error(`Enter valid type of ${key}`);
    // }

    // check & convert date type data
    // check object type data
    // check array type data
  }
};
