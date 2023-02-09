const KoaRouter = require("koa-router");
const { addComment, myComment } = require("../controllers/comment.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const {
  validateInsertComment, validateUpdateComment,
} = require("../validators/comment.validator");
const router = new KoaRouter({ prefix: "/comment" });

router.post("/add", checkAuth, validateInsertComment, addComment);
router.patch("/update", checkAuth, validateUpdateComment, addComment);
router.get("/my", checkAuth, myComment);

module.exports = router;
