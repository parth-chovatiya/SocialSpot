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

router.post("/create", checkAuth, validateInsertPage, createPage);
router.patch("/update/:pageId", checkAuth, validateUpdatePage, updatePage);

router.post("/givePermission", checkAuth, validatePermission, givePermission);
router.post("/removePermission", checkAuth, removePermission);
router.get("/myPages", checkAuth, fetchMyPages);
router.get("/postPublishRequests", checkAuth, fetchAllPostPublishRequest);
router.post(
  "/acceptPostPublishRequests",
  checkAuth,
  acceptPostPublishRequestsValidation,
  acceptPostPublishRequests
);
router.get("/followedPages", checkAuth, followedPages);
router.get("/permissionPages", checkAuth, permissionPages);

module.exports = router;
