const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/auth" });

router.get("/login", async (ctx) => {
  ctx.body = "Login";
});

module.exports = router;
