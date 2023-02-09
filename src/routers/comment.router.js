const KoaRouter = require("koa-router");
const {
  addComment,
  myComment,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const {
  validateInsertComment,
  validateUpdateComment,
} = require("../validators/comment.validator");
const router = new KoaRouter({ prefix: "/comment" });

router.post("/add", checkAuth, validateInsertComment, addComment);
router.patch(
  "/update/:commentId",
  checkAuth,
  validateUpdateComment,
  updateComment
);
router.delete("/delete/:commentId", checkAuth, deleteComment);
router.get("/my", checkAuth, myComment);

module.exports = router;
