const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/post" });

const {
  createPost,
  fetchAllPublicPosts,
  fetchAllPrivatePosts,
  fetchAllMyPosts,
  updatePost,
} = require("../controllers/post.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const {
  checkCreatePermission,
  sendPostPublishRequest,
} = require("../middlewares/checkPermission");
const {
  validateInsertPost,
  validateUpdatePost,
} = require("../validators/post.validation");

router.post(
  "/createPost",
  checkAuth,
  validateInsertPost,
  checkCreatePermission,
  sendPostPublishRequest,
  createPost
);
router.patch(
  "/updatePost",
  checkAuth,
  validateUpdatePost,
  checkCreatePermission,
  sendPostPublishRequest,
  updatePost
);
router.get("/fetchPublic", fetchAllPublicPosts);
router.get("/fetchPrivate", checkAuth, fetchAllPrivatePosts);
router.get("/myPosts", checkAuth, fetchAllMyPosts);

module.exports = router;
