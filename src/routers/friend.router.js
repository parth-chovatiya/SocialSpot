const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/friend" });

const {
  sendFriendRequest,
  acceptFriendRequest,
  allFriends,
  cancelFriendRequest,
  removeFriend,
  friendRequests,
} = require("../controllers/friend.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const { validateFriend } = require("../validators/friend.validator");

router.post("/sendFriendRequest", checkAuth, validateFriend, sendFriendRequest);
router.post("/acceptFriendRequest", checkAuth, acceptFriendRequest);
router.post("/cancelFriendRequest", checkAuth, cancelFriendRequest);
router.get("/friendRequests", checkAuth, friendRequests);
router.post("/removeFriend", checkAuth, removeFriend);
router.get("/friends", checkAuth, allFriends);

module.exports = router;
