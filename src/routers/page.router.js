const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/page" });

const {
  createPage,
  givePermission,
  removePermission,
  fetchMyPages,
  fetchAllPostPublishRequest,
  acceptPostPublishRequests,
  followedPages,
  permissionPages,
  updatePage,
  deletePage,
  searchPages,
  fetchUsersPages,
} = require("../controllers/page.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const {
  validateInsertPage,
  validateUpdatePage,
} = require("../validators/page.validation");
const {
  validatePermission,
  acceptPostPublishRequestsValidation,
} = require("../validators/permission.validation");

// create page
router.post("/create", checkAuth, validateInsertPage, createPage);

// update page
router.patch("/update/:pageId", checkAuth, validateUpdatePage, updatePage);

// delete page
router.delete("/delete/:pageId", checkAuth, deletePage);

// give permission to the user
router.post("/givePermission", checkAuth, validatePermission, givePermission);

// remove permission from user
router.post("/removePermission", checkAuth, removePermission);

// fetch the my pages
router.get("/myPages", checkAuth, fetchMyPages);

// fetch all post publish requests
router.get("/postPublishRequests", checkAuth, fetchAllPostPublishRequest);

// accept the post publish request
router.post(
  "/acceptPostPublishRequests",
  checkAuth,
  acceptPostPublishRequestsValidation,
  acceptPostPublishRequests
);

// pages which users following
router.get("/followedPages", checkAuth, followedPages);

// pages in which they have permission
router.get("/permissionPages", checkAuth, permissionPages);

// search the pages -> pageName, pageDescription
router.post("/search", searchPages);

// fetch users pages
router.get("/user/:userId", checkAuth, fetchUsersPages);

module.exports = router;
