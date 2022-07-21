const Blog = require("./../model/Blog");
const cloudinary = require("./../config/cloudinary");
const { shuffleArray } = require("./../middleware/common.middleware");
const Category = require("./../model/BlogCategory");
const fs = require("fs");
const path = require("path");
exports.Create = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    let blogObj = {
      title,
      content,
      category,
      headingImg: { url: null, cloudinary_id: null },
      creator: req.user._id,
    };
    if (req.file) {
      if (process.env.production == "true") {
        const result = await cloudinary.uploader.upload(req.file.path);
        blogObj.headingImg.url = result.secure_url;
        blogObj.headingImg.cloudinary_id = result.public_id;
      } else {
        blogObj.headingImg.url =
          process.env.url_public_folder + req.file.filename;
      }
    }
    const saved = await new Blog(blogObj).save();
    return res.status(200).json({ msg: "Successfully Created", saved });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ msg: "Successfully Created", e });
  }
};

exports.getPublishedOwner = async (req, res) => {
  try {
    const { page = 0 } = req.query;
    Blog.find({ creator: req.user._id })
      .populate("category")
      .populate("creator")
      .limit(10)
      .sort({ createdAt: -1 })
      .skip(page * 10)
      .exec(function (err, blog) {
        Blog.find({ creator: req.user._id })
          .count()
          .exec(function (err, count) {
            return res.status(200).json({
              blog,
              count,
              totalPages: Math.ceil(count / 10),
            });
          });
      });
  } catch (e) {
    console.log(e);
    return res.status(200).json({ blog: [] });
  }
};
exports.getLatestBlog = async (req, res) => {
  try {
    const blog = await Blog.find()
      .limit(10)
      .populate("category")
      .populate({
        path: "creator",
        select: "name profile",
      })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ blog : shuffleArray(blog)});
  } catch (e) {
    return res.status(400).json({ msg: e });
  }
};
exports.getBlogByCategory = async (req, res) => {
  try {
    const { page = 0, category } = req.query;
    Blog.find({ category })
      .populate("category")
      .populate("creator")
      .limit(10)
      .sort({ createdAt: -1 })
      .skip(page * 10)
      .exec(function (err, blog) {
        Blog.find({ creator: req.user._id })
          .count()
          .exec(function (err, count) {
            return res.status(200).json({
              blog,
              count,
              totalPages: Math.ceil(count / 10),
            });
          });
      });
  } catch (e) {
    return res.status(400).json({ msg: e });
  }
};
exports.getBlogContent = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id })
      .populate("category")
      .populate({ path: "creator", select: "-password -passwordToken" })
      .populate("comments.user")
      .lean();
    if (blog) {
      const published = await Blog.find({ creator: blog.creator._id }).lean();
      return res
        .status(200)
        .json({ blog: { ...blog, createPublished: published.length } });
    }
    return res.status(400).json({ msg: "blog does not exist" });
  } catch (e) {
    return res.status(400).json({ msg: "blog does not exist" });
  }
};
exports.getSuggestion = async (req, res) => {
  try {
    const { page = 0 } = req.query;
    const byCategory = await Blog.find({
      category: req.query.category,
      _id: { $ne: req.query.blog_id },
    })
      .populate("category")
      .populate("creator")
      .populate("comments.user")
      .limit(6)
      .sort({ createdAt: -1 })
      .skip(page * 6)
      .lean();
    const creator = await Blog.find({
      category: req.query.creator,
      $and: [
        { _id: { $ne: req.query.blog_id } },
        {
          _id: {
            $nin: byCategory.map((content) => {
              return content._id;
            }),
          },
        },
      ],
    })
      .populate("category")
      .populate("creator")
      .populate("comments.user")
      .limit(6)
      .sort({ createdAt: -1 })
      .skip(page * 6)
      .lean();

    return res
      .status(200)
      .json({ blog: shuffleArray([...byCategory, ...creator]) });
  } catch (e) {
    return res.status(400).json({ msg: "failed" });
  }
};
exports.createComment = async (req, res) => {
  try {
    const { parentComment = null, comment, blog_id } = req.body;
    const updating = await Blog.findByIdAndUpdate(
      { _id: blog_id },
      {
        $push: {
          comments: {
            parentComment,
            comment,
            user: req.user._id,
          },
        },
      },
      { upsert: true }
    );
    if (updating) {
      return res.status(200).json({
        msg: "Successfully commented",
        comment: {
          parentComment,
          comment,
          user: req.user._id,
        },
      });
    }
    return res.status(400).json({ msg: "failed to comment" });
  } catch (e) {
    return res.status(400).json({ msg: "failed to comment" });
  }
};

exports.deleteBlogPost = async(req, res) => {
  try{
    const {id} = req.params;
    const blog = await Blog.findOne({_id: id}).lean();
    if(blog){
      if(process.env.production == "true"){
        await cloudinary.uploader.destroy(blog.headingImg.cloudinary_id);
      }else{
        const pathname = path.basename(blog.headingImg.url);
        console.log(pathname);
        fs.unlinkSync(`./src/uploads/${pathname}`)
      }
     
    }
    const deleting = await Blog.findOneAndDelete({_id: id});
    if(deleting){
      return res.status(200).json({msg: "Successfully Deleted"});
    }
    return res.status(400).json({msg: "Failed to Delete This Blog"})
  }catch(e){
    return res.status(400).json({msg: "Failed to Delete This Blog"})
  }
}
exports.updateBlogPost = async(req, res) => {
  try{
    const { title, content, category, id, cloudinary_id } = req.body;
    Blog.findOne({_id: id, creator: req.user._id})
    .then(async (result) => {
      if(result){
        result.title = title;
        result.content = content;
        result.category = category;
        if (req.file) {
          if(cloudinary_id){
            await cloudinary.uploader.destroy(cloudinary_id);
          }
          const resultNew = await cloudinary.uploader.upload(req.file.path);
          result.headingImg.url = resultNew.secure_url;
          result.headingImg.cloudinary_id = resultNew.public_id;
          const saving = await result.save();
          if(saving){
            const blogUpdated = await Blog.findOne({_id: id, creator: req.user._id}).populate("category").lean();
            return res.status(200).json({msg: "Successfully Update Content", blog: blogUpdated})
          }
          return res.status(400).json({msg: "Failed to Update Content"})
        }
        const saving = await result.save();
        if(saving){
          const blogUpdated = await Blog.findOne({_id: id, creator: req.user._id}).populate("category").lean();
          return res.status(200).json({msg: "Successfully Update Content", blog: blogUpdated})
        }
      }
      return res.status(400).json({msg: "Failed to Update Content"})
    }).catch(e => {
      console.log("error in catching",e)
      return res.status(400).json({msg: "Failed to Update Content"})
    })
  }catch(e){
    console.log("error in pinka ubos",e)
    return res.status(400).json({msg: "Failed to Update Content"})
  }
}
exports.getToUpdatePublishBlog = async(req, res) => {
  try{
    const {id} = req.params;
    const blog = await Blog.findOne({_id: id, creator: req.user._id}).populate("category").lean();
    if(blog){
      const categories = await Category.find().lean();
      return res.status(200).json({blog,categories })
    }
    return res.status(400).json({msg: "failed to get Blog Content"})
  }catch(e){
    return res.status(400).json({msg: "failed to get Blog Content"})
  }
}