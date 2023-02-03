const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/api/v1" });

const authRouter = require("./auth.router");
const userRouter = require("./user.route");
const postRouter = require("./post.route");

const ROUTERS = [authRouter, userRouter, postRouter];

ROUTERS.forEach((route) => {
  router.use(route.routes()).use(route.allowedMethods());
});

module.exports = router;
