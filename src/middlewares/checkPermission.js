const { ObjectId } = require("mongodb");

const { sendResponce } = require("../utils/sendResponce");

// Middleware to check the create permission
exports.checkCreatePermission = async (ctx, next) => {
  try {
    const { pageId } = ctx.request.body;

    // If pageId is not there, do operations in the profile page
    if (!pageId) {
      return await next();
    }

    const page = await ctx.db.collection("Pages").findOne({
      _id: new ObjectId(pageId),
    });

    ctx.assert(page, 404, "Page not found.");
    if (page.owner.toString() === ctx._id.toString()) {
      return await next();
    }

    const permission = await ctx.db.collection("Permissions").findOne({
      pageId: new ObjectId(pageId),
      userId: new ObjectId(ctx._id),
    });

    ctx.assert(
      permission?.permissions?.includes("create"),
      400,
      "You didn't have permission to create post."
    );
    if (!permission?.permissions?.includes("create")) {
      return sendResponce({
        ctx,
        statusCode: 400,
        message: "You didn't have permission to create post..",
      });
    }

    ctx.request.body.isVisible = false;
    ctx.request.body.authorId = new ObjectId(ctx._id);
    ctx.request.body.pageId = new ObjectId(pageId);
    await next();
  } catch (error) {
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// Middleware to check the update permission
exports.checkUpdatePermission = async (ctx, next) => {
  try {
    const postId = ctx.params.postId;

    // If owner, then they can directly do the operations
    // If team members then if they have permission then only they can do operation
    const post = await ctx.db
      .collection("Posts")
      .aggregate([
        {
          $match: {
            _id: new ObjectId(postId),
          },
        },
        {
          $lookup: {
            from: "Pages",
            localField: "pageId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  pageOwner: "$owner",
                },
              },
            ],
            as: "page",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ["$page", 0],
                },
                "$$ROOT",
              ],
            },
          },
        },
        {
          $project: {
            page: 0,
          },
        },
      ])
      .toArray();

    ctx.assert(post.length, 404, "Post not found.");

    const permission = await ctx.db.collection("Permissions").findOne({
      pageId: new ObjectId(post[0].pageId),
      userId: new ObjectId(ctx._id),
    });

    if (post[0]?.pageOwner?.toString() === ctx._id.toString()) {
      return await next();
    }
    if (!post[0].pageId && post[0].authorId.toString() === ctx._id.toString()) {
      return await next();
    }

    if (!permission?.permissions?.includes("update")) {
      return sendResponce({
        ctx,
        statusCode: 400,
        message: "You didn't have permission to update post.",
      });
    }

    await next();
  } catch (error) {
    console.log(error);
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};

// Middleware to check the delete permission
exports.checkDeletePermission = async (ctx, next) => {
  try {
    const postId = ctx.params.postId;

    const post = await ctx.db
      .collection("Posts")
      .aggregate([
        {
          $match: {
            _id: new ObjectId(postId),
          },
        },
        {
          $lookup: {
            from: "Pages",
            localField: "pageId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  pageOwner: "$owner",
                },
              },
            ],
            as: "page",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ["$page", 0],
                },
                "$$ROOT",
              ],
            },
          },
        },
        {
          $project: {
            page: 0,
          },
        },
      ])
      .toArray();

    ctx.assert(post.length, 404, "Post not found.");

    const permission = await ctx.db.collection("Permissions").findOne({
      pageId: new ObjectId(post[0].pageId),
      userId: new ObjectId(ctx._id),
    });

    if (post[0]?.pageOwner?.toString() === ctx._id.toString()) {
      return await next();
    }
    if (!post[0].pageId && post[0].authorId.toString() === ctx._id.toString()) {
      return await next();
    }

    if (!permission?.permissions?.includes("delete")) {
      return sendResponce({
        ctx,
        statusCode: 400,
        message: "You didn't have permission to delete post.",
      });
    }

    await next();
  } catch (error) {
    console.log(error);
    sendResponce({ ctx, statusCode: 400, error: error.message });
  }
};
