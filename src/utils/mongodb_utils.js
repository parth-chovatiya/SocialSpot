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

exports.fetchFullName = (localFieldName, foreignFieldName) => {
  return {
    $lookup: {
      from: "Users",
      localField: localFieldName,
      foreignField: foreignFieldName,
      pipeline: [
        {
          $project: {
            _id: 0,
            fullName: this.FullName,
            profilePic: 1,
          },
        },
      ],
      as: "user",
    },
  };
};

exports.replaceRootFullname = {
  $replaceRoot: {
    newRoot: { $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"] },
  },
};

exports.sortByLatest = { $sort: { createdAt: -1 } };
