const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/auth" });

const {
  register,
  login,
  verifyEmail,
} = require("../controllers/auth.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const {
  validate_email,
  validate_password,
  validate_username,
} = require("../validators/generalValidation");
const { registerValidation } = require("../validators/registerValidation");
const { validateData } = require("../validators/validateData");

router.post(
  "/register",
  validateData,
  registerValidation,
  validate_username,
  validate_email,
  validate_password,
  register
);
router.post("/login", login);
router.patch("/verifyEmail", checkAuth, verifyEmail);

module.exports = router;
