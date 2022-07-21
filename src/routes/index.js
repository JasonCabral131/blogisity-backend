const router = require("express").Router();
const User = require("./user");
const Category = require("./category");
const Blog = require("./blog");
const { searchable } = require("../controller/globalsearch");
const Notification = require("./notification")
const Messenge = require("./messenge")
router.use("/user",User);
router.use("/category",Category);
router.use("/blog",Blog);
router.use("/search", searchable)
router.use("/notification", Notification)
router.use("/messenges",Messenge )
module.exports = router;