const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/page" });

const {
  createPage,
  givePermission,
} = require("../controllers/page.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const { validatePage } = require("../validators/page.validation");
const { validatePermission } = require("../validators/permission.validation");

router.post("/create", checkAuth, validatePage, createPage);

// Give permission to the user
router.post("/givePermission", checkAuth, validatePermission, givePermission);

module.exports = router;
