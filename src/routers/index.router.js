const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/api/v1" });

const authRouter = require("./auth.router");

const ROUTERS = [authRouter];

ROUTERS.forEach((route) => {
  router.use(route.routes()).use(route.allowedMethods());
});

module.exports = router;
