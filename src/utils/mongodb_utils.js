// To merge the firstName with lastName
exports.FullName = {
  $concat: [
    "$firstName",
    {
      $cond: {
        if: { $eq: ["$lastName", null] },
        then: "",
        else: { $concat: [" ", "$lastName"] },
      },
    },
  ],
};

// fetch the fullname by doing lookup
exports.fetchFullName = (localFieldName, foreignFieldName, fieldName, as) => {
  const project = {
    _id: 0,
    profilePic: 1,
  };
  project[fieldName] = this.FullName;

  return {
    $lookup: {
      from: "Users",
      localField: localFieldName,
      foreignField: foreignFieldName,
      pipeline: [{ $project: project }],
      as: as,
    },
  };
};


// replace root to merge fullName with perticular document
exports.replaceRootFullname = (fieldName) => {
  return {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ $arrayElemAt: [`$` + fieldName, 0] }, "$$ROOT"],
      },
    },
  };
};

exports.sortByLatest = { $sort: { createdAt: -1 } };
