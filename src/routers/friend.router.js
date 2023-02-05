const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/friend" });

const {
  sendFriendRequest,
  acceptFriendRequest,
} = require("../controllers/friend.controller");
const { checkAuth } = require("../middlewares/checkAuth");

router.post("/sendFriendRequest", checkAuth, sendFriendRequest);
router.post("/acceptFriendRequest", checkAuth, acceptFriendRequest);

module.exports = router;
