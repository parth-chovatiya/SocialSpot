const KoaRouter = require("koa-router");
const { saveChat, fetchChat } = require("../controllers/chat.controller");
const router = new KoaRouter({ prefix: "/chat" });

const { checkAuth } = require("../middlewares/checkAuth");
const { isBothFriendChat } = require("../validators/friend.validator");

// save chat
router.post("/saveChat/:friendId", checkAuth, isBothFriendChat, saveChat);
// fetch chat
router.get("/fetchChat/:friendId", checkAuth, isBothFriendChat, fetchChat);

module.exports = router;
