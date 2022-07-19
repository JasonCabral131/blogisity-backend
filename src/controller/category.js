const Category = require("./../model/BlogCategory");
const Blog = require("./../model/Blog");
exports.Create = async (req, res) => {
  try {
    const { category, description } = req.body;
    const save = await new Category({
      category,
      description,
    }).save();
    return res.status(200).json({ msg: "Successfully Created",save  });
  } catch (e) {
    return res.status(400).json({ msg: "Failed to Create" });
  }
};

exports.Categories = async (req, res) => {
  try {

    const { page = 0, query = "" } = req.query;
    let finder = null;
    const allQuery = [  {
      category: { $regex: query , '$options': 'i'},
    },
    {
        description: { $regex: query, '$options': 'i' },
    },]
    if(isNaN(query)){
      finder =  [
        ...allQuery
      ]
    }else{
      finder = query == "" ?   [...allQuery] :[...allQuery,{id: parseInt(query)}] ;
    }
    Category.find({
      $or: finder,
    })
      .limit(10)
      .skip(page * 10)
      .exec(function (err, categories) {
        if(err) return res.status(400).json({e: err});
        Category.find({
          $or: finder,
        })
          .count()
          .exec(function (err, count) {
            return res.status(200).json({
              categories,
              count,
              totalPages: Math.ceil(count / 10),
            });
          });
      });
  } catch (e) {
    console
    return res.status(400).json({ msg: e });
  }
};

exports.getAllCategories = async(req, res) => {
    try{
      const {create} = req.query;
      const datas = await Category.find().lean();
      let categoryNew = [];
      console.log(create)
     for(let i = 0; i < datas.length; i++){
        const blogs = await Blog.find({category: datas[i]._id}).lean();
      if(create){
        categoryNew = [...categoryNew, datas[i]]
      }else{
        if(blogs.length > 0){
          categoryNew = [...categoryNew, datas[i]]
        }
      }
      
     }
      return res.status(200).json({data:categoryNew })
    }catch(e){
      return res.status(200).json({data:[]})
    }
}
exports.Delete = async(req, res) => {
  try{
   await Category.deleteOne({id: req.params.id});
    return res.status(200).json({msg: "successfully deleted"});
  }catch(e){
    return res.status(400).json({msg: "Failed to delete"});
  }
}
exports.getBlogByCategory = async(req, res) => {
  try{
    const {category, page = 0} = req.query;
    const blogs = await Blog.find({category}) .limit(10)
    .populate("category")
    .populate("creator")
    .skip(page * 10)
    .sort({ createdAt: -1 })
    .lean();
    const count = await Blog.find({category}).count();
    return res.status(200).json({blog: blogs,   totalPages: Math.ceil(count / 10),})
  }catch(e){  
    return res.status(400).json({msg: "Failed to get Content"})

  }
}