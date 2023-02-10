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

// add comment to the perticular post or comment
router.post("/add", checkAuth, validateInsertComment, addComment);

// update comment
router.patch(
  "/update/:commentId",
  checkAuth,
  validateUpdateComment,
  updateComment
);

// delete comments
router.delete("/delete/:commentId", checkAuth, deleteComment);

// fetch my comments
router.get("/my", checkAuth, myComment);

module.exports = router;
