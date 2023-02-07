const { ObjectId } = require("mongodb");

const { createPage, givePermission } = require("../queries/page.queries");
const { sendResponce } = require("../utils/sendResponce");

// @route   POST /api/v1/page/create
// @desc    Create Page
// @access  Private
exports.createPage = async (ctx) => {
  try {
    const Pages = ctx.db.collection("Pages");

    const page = await createPage({ Pages, newData: ctx.request.body });

    sendResponce({ ctx, statusCode: 200, message: "Page created.", page });
  } catch (error) {
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};

// @route   POST /api/v1/page/givePermission
// @desc    Give Permission to the User of the perticular page
// @access  Private
exports.givePermission = async (ctx) => {
  try {
    const { pageId, userId, role } = ctx.request.body;

    delete ctx.request.body.role;

    // const storePermission = await givePermission({
    //   Permissions: ctx.db.collection("Permissions"),
    //   filter: { pageId, userId },
    //   newData: { $set: ctx.request.body },
    //   projection: { upsert: true },
    // });

    const storePermission = await ctx.db.collection("Permissions").updateOne(
      {
        pageId,
        userId,
      },
      {
        $set: ctx.request.body,
        $push: { role: role },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    sendResponce({ ctx, statusCode: 200, message: "Permission given." });
  } catch (error) {
    console.log(error);
    sendResponce({
      ctx,
      statusCode: error.statusCode || 400,
      message: error.message,
    });
  }
};
