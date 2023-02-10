const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/reaction" });

const { like, unlike } = require("../controllers/reaction.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const { validateLike } = require("../validators/reaction.validate");

// like the post or comment
router.post("/like", checkAuth, validateLike, like);

// unlike the post or comment
router.post("/unlike", checkAuth, unlike);

module.exports = router;
