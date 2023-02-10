const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/user" });

const {
  setProfile,
  getProfile,
  searchUsers,
} = require("../controllers/user.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const { updateProfileValidation } = require("../validators/user.validation");

// Update profile
router.patch("/profile", checkAuth, updateProfileValidation, setProfile);

// Fetch User profile
router.get("/profile", checkAuth, getProfile);

// Search User
router.post("/search", searchUsers);

module.exports = router;
