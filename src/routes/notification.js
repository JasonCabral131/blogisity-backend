const router = require("express").Router();
const { createComment } = require("../controller/notification");
const {authenticator} = require("./../middleware/auth.middleware");
router.put("/comment-user-blog", authenticator, createComment)
module.exports = router;