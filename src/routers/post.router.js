const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/post" });

const {
  createPost,
  fetchAllPublicPosts,
  fetchAllPrivatePosts,
  fetchAllMyPosts,
  updatePost,
  deletePost,
  searchPost,
} = require("../controllers/post.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const {
  checkCreatePermission,
  checkUpdatePermission,
  checkDeletePermission,
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
  createPost
);
router.patch(
  "/updatePost/:postId",
  checkAuth,
  validateUpdatePost,
  checkUpdatePermission,
  updatePost
);
router.delete(
  "/deletePost/:postId",
  checkAuth,
  checkDeletePermission,
  deletePost
);
router.get("/fetchPublic", fetchAllPublicPosts);
router.get("/fetchPrivate", checkAuth, fetchAllPrivatePosts);
router.get("/myPosts", checkAuth, fetchAllMyPosts);

router.post("/search", searchPost);

module.exports = router;
