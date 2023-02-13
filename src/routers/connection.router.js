const KoaRouter = require("koa-router");
const {
  followPage,
  unfollowPage,
} = require("../controllers/connection.controller");
const router = new KoaRouter({ prefix: "/connection" });

const { checkAuth } = require("../middlewares/checkAuth");
const { validateConnection, checkConnectionExists } = require("../validators/connection.validation");

// follow perticular page
router.post("/followPage/:pageId", checkAuth, validateConnection, followPage);

// unfollow perticular page
router.post("/unfollowPage/:pageId", checkAuth, checkConnectionExists, unfollowPage);

module.exports = router;
