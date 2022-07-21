const router = require("express").Router();
const { sendMessage, getMessenges } = require("../controller/messenge");
const { upload } = require("../middleware/common.middleware");
const {authenticator} = require("./../middleware/auth.middleware");

router.put("/send-messenges",authenticator, upload.array("files"), sendMessage );
router.get("/:reciever",authenticator, getMessenges );
module.exports = router