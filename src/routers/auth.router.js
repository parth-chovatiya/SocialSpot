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
} = require("../validators/user.validation");

// register user
router.post("/register", registerValidation, register);

// login user
router.post("/login", loginValidation, login);

// verify email address
router.get("/verifyEmail/:id", verifyEmail);

module.exports = router;
