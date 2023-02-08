const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/post" });

const {
  createProfilePost,
  fetchAllPublicPosts,
  fetchAllPrivatePosts,
  fetchAllMyPosts,
} = require("../controllers/post.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const { validatePost } = require("../validators/post.validation");

router.post("/createProfilePost", checkAuth, validatePost, createProfilePost);
router.get("/fetchPublic", fetchAllPublicPosts);
router.get("/fetchPrivate", checkAuth, fetchAllPrivatePosts);
router.get("/myPosts", checkAuth, fetchAllMyPosts);

module.exports = router;
