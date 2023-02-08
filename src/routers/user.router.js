const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/user" });

const { setProfile, getProfile } = require("../controllers/user.controller");
const { checkAuth } = require("../middlewares/checkAuth");

router.patch("/profile", checkAuth, setProfile);
router.get("/profile", checkAuth, getProfile);

module.exports = router;
