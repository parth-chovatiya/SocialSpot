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

// create post
router.post(
  "/createPost",
  checkAuth,
  validateInsertPost,
  checkCreatePermission,
  createPost
);

// update post
router.patch(
  "/updatePost/:postId",
  checkAuth,
  validateUpdatePost,
  checkUpdatePermission,
  updatePost
);

// delete post
router.delete(
  "/deletePost/:postId",
  checkAuth,
  checkDeletePermission,
  deletePost
);

// fetch public post feed
router.get("/fetchPublic", fetchAllPublicPosts);

// fetch private post feed
router.get("/fetchPrivate", checkAuth, fetchAllPrivatePosts);

// fetch all posts which was posted by me
router.get("/myPosts", checkAuth, fetchAllMyPosts);

// search the posts -> postDescription
router.post("/search", searchPost);

module.exports = router;
