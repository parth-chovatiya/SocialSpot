const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/auth" });

const {
  register,
  login,
  verifyEmail,
} = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../validators/register.validation");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.patch("/verifyEmail/:id", verifyEmail);

module.exports = router;
