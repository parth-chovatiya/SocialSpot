const KoaRouter = require("koa-router");
const {
  followPage,
  unfollowPage,
} = require("../controllers/connection.controller");
const router = new KoaRouter({ prefix: "/connection" });

const { checkAuth } = require("../middlewares/checkAuth");
const { validateConnection, checkConnectionExists } = require("../validators/connection.validation");

router.post("/followPage", checkAuth, validateConnection, followPage);
router.post("/unfollowPage", checkAuth, checkConnectionExists, unfollowPage);

module.exports = router;
