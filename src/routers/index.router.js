const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/api/v1" });

const authRouter = require("./auth.router");
const userRouter = require("./user.router");
const postRouter = require("./post.router");
const friendRouter = require("./friend.router");
const commentRouter = require("./comment.router");
const pageRouter = require("./page.router");
const connectionRouter = require("./connection.router");
const reactionRouter = require("./reaction.router");
const chatRouter = require("./chat.router");

const ROUTERS = [
  authRouter,
  userRouter,
  postRouter,
  friendRouter,
  commentRouter,
  pageRouter,
  connectionRouter,
  reactionRouter,
  chatRouter,
];

ROUTERS.forEach((route) => {
  router.use(route.routes()).use(route.allowedMethods());
});

module.exports = router;
