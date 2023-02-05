const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/post" });

const { createPost } = require("../controllers/post.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const { validatePost } = require("../validators/post.validation");

router.post("/create", checkAuth, validatePost, createPost);

module.exports = router;
