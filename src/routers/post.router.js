const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/post" });

const {
  createPost,
  fetchAllPublicPosts,
  fetchAllPrivatePosts,
  fetchAllMyPosts,
} = require("../controllers/post.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const { checkCreatePermission, sendPostPublishRequest } = require("../middlewares/checkPermission");
const { validatePost } = require("../validators/post.validation");

router.post(
  "/createPost",
  checkAuth,
  validatePost,
  checkCreatePermission,
  sendPostPublishRequest,
  createPost
);
router.get("/fetchPublic", fetchAllPublicPosts);
router.get("/fetchPrivate", checkAuth, fetchAllPrivatePosts);
router.get("/myPosts", checkAuth, fetchAllMyPosts);

module.exports = router;
