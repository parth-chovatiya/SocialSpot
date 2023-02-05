const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/api/v1" });

const authRouter = require("./auth.router");
const userRouter = require("./user.router");
const postRouter = require("./post.router");
const friendRouter = require("./friend.router");

const ROUTERS = [authRouter, userRouter, postRouter, friendRouter];

ROUTERS.forEach((route) => {
  router.use(route.routes()).use(route.allowedMethods());
});

module.exports = router;
