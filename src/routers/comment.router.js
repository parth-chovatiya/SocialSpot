const KoaRouter = require("koa-router");
const { addComment } = require("../controllers/comment.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const { validateComment } = require("../validators/comment.validator");
const router = new KoaRouter({ prefix: "/comment" });

router.post("/add", checkAuth, validateComment, addComment);

module.exports = router;
