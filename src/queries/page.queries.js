exports.createPageQuery = ({ Pages, filter, newData, projection }) =>
  Pages.insertOne(newData);

exports.givePermission = ({ Permissions, filter, newData, projection }) =>
  Permissions.updateOne(filter, newData, projection);

const FullName = {
  $concat: [
    "$firstName",
    {
      $cond: {
        if: {
          $eq: ["$lastName", null],
        },
        then: "",
        else: {
          $concat: [" ", "$lastName"],
        },
      },
    },
  ],
};

exports.fetchAllPostPublishRequestQuery = ({ Pages, filter, newData, projection }) =>
  Pages.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "Posts",
        localField: "_id",
        foreignField: "pageId",
        pipeline: [
          {
            $match: {
              isVisible: false,
            },
          },
          {
            $lookup: {
              from: "Users",
              localField: "createdBy",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    requested_name: FullName,
                  },
                },
              ],
              as: "createdBy",
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  {
                    $arrayElemAt: ["$createdBy", 0],
                  },
                  "$$ROOT",
                ],
              },
            },
          },
          {
            $project: {
              createdBy: 0,
            },
          },
        ],
        as: "page",
      },
    },
  ]).toArray();
