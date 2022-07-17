const router = require("express").Router();
const {Create,Categories, getAllCategories, Delete, getBlogByCategory} = require("./../controller/category")
router.put("", Create);
router.get("/categories", Categories);
router.get("/all-categories", getAllCategories);
router.delete("/:id", Delete);
router.get("/get-category-blog-list", getBlogByCategory)
module.exports = router;