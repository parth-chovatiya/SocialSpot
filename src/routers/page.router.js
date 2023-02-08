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
} = require("../controllers/page.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const { validatePage } = require("../validators/page.validation");
const { validatePermission } = require("../validators/permission.validation");

router.post("/create", checkAuth, validatePage, createPage);

router.post("/givePermission", checkAuth, validatePermission, givePermission);
router.post("/removePermission", checkAuth, removePermission);
router.get("/myPages", checkAuth, fetchMyPages);
router.get("/postPublishRequests", checkAuth, fetchAllPostPublishRequest);
router.post("/acceptPostPublishRequests", checkAuth, acceptPostPublishRequests);
router.get("/followedPages", checkAuth, followedPages);
router.get("/permissionPages", checkAuth, permissionPages);

module.exports = router;
