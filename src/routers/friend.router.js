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
const {
  validateFriend,
  isFriendRequestSended,
  isBothFriend,
} = require("../validators/friend.validator");

router.post(
  "/sendFriendRequest/:friendId",
  checkAuth,
  validateFriend,
  sendFriendRequest
);
router.post(
  "/acceptFriendRequest/:friendId",
  checkAuth,
  isBothFriend,
  acceptFriendRequest
);
router.post(
  "/cancelFriendRequest/:friendId",
  checkAuth,
  isFriendRequestSended,
  cancelFriendRequest
);
router.post("/removeFriend/:friendId", checkAuth, removeFriend);
router.get("/friendRequests", checkAuth, friendRequests);
router.get("/friends", checkAuth, allFriends);

module.exports = router;
