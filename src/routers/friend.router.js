const KoaRouter = require("koa-router");
const router = new KoaRouter({ prefix: "/friend" });

const {
  sendFriendRequest,
  acceptFriendRequest,
  allFriends,
  cancelFriendRequest,
  removeFriend,
  friendRequests,
  sendedFriendRequests,
} = require("../controllers/friend.controller");
const { checkAuth } = require("../middlewares/checkAuth");
const {
  validateFriend,
  isFriendRequestSended,
  isBothFriend,
} = require("../validators/friend.validator");

// send friend request
router.post(
  "/sendFriendRequest/:friendId",
  checkAuth,
  validateFriend,
  sendFriendRequest
);

// accept friend request
router.post(
  "/acceptFriendRequest/:friendId",
  checkAuth,
  isBothFriend,
  acceptFriendRequest
);

// cancel friend request
router.post(
  "/cancelFriendRequest/:friendId",
  checkAuth,
  isFriendRequestSended,
  cancelFriendRequest
);

// remove from my friend lists
router.post("/removeFriend/:friendId", checkAuth, removeFriend);

// fetch all the friend requests
router.get("/friendRequests", checkAuth, friendRequests);

// fetch the friend requests which was sended by me
router.get("/sendedFriendRequests", checkAuth, sendedFriendRequests);

// fetch all my friends
router.get("/friends", checkAuth, allFriends);

module.exports = router;
