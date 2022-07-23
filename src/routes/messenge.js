const router = require("express").Router();
const { sendMessage, getMessenges , getAllWriter, getAllFollowed, getChatsRoom} = require("../controller/messenge");
const { upload } = require("../middleware/common.middleware");
const {authenticator} = require("./../middleware/auth.middleware");

router.put("/send-messenges",authenticator, upload.array("files"), sendMessage );
router.get("/:reciever",authenticator, getMessenges );
router.get("/writer/list-writer", authenticator, getAllWriter)
router.get("/writer/followed-writer", authenticator, getAllFollowed)
router.get("/messenges/inbox", authenticator, getChatsRoom)
module.exports = router