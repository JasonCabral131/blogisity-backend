const router = require("express").Router();
const {authenticator} = require("./../middleware/auth.middleware");
const {upload} = require('./../middleware/common.middleware');
const {Create, getLatestBlog, getBlogByCategory, getBlogContent, getSuggestion, createComment, updateBlogPost, deleteBlogPost, getToUpdatePublishBlog} = require("./../controller/blog");

router.put("/", authenticator, upload.single('file'), Create)
router.get("/latest",getLatestBlog );
router.get("/view-category", getBlogByCategory)
router.get("/blog-suggestion",getSuggestion)
router.get("/view-blog-info-content/:id", getBlogContent );

router.post("/send-comment-blog/", authenticator, createComment)
router.put("/update-blog", authenticator, upload.single('file'),updateBlogPost)
router.delete("/:id", authenticator, deleteBlogPost)
router.get("/blog-content-info/:id", authenticator, getToUpdatePublishBlog);
module.exports = router;