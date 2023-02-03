const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/post" });

const { createPost } = require("../controllers/post.controller");
const { checkAuth } = require("../middlewares/checkAuth");

router.post("/create", checkAuth, createPost);

module.exports = router;
