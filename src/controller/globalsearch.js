
const Blog = require("./../model/Blog");
const Category = require("./../model/BlogCategory");
const User = require("./../model/user");

exports.searchable = async(req, res) => {
   
        const { query = "" } = req.query;

        const user = await User.find({  'name': {'$regex': query, '$options': 'i' }, onboarding: 1, $or: [{status: 1}, {status: 2}] }).limit(5).lean();
        const blog = await Blog.find({
            $or: [
                { title: { $regex: query , '$options': 'i' } },
                { content: { $regex: query , '$options': 'i' } }
            ]
        }).limit(5).lean();
        const category = await Category.find({
            $or: [
                { category: { $regex: query , '$options': 'i' } },
                { description: { $regex: query , '$options': 'i' } }
            ]
        }).limit(5).lean();

        let searchProvider = {};
        if(user.length > 0){
            searchProvider.user = user.map(data => {
                return {url: `/view-user/${data._id}`, ...data}
            })
        }
        if(blog.length > 0){
            searchProvider.blog = blog.map(data => {
                return {url: `/view-blog/${data._id}`, ...data}
            })
        }
        if(category.length > 0){
            searchProvider.category = category.map(data => {
                return {url: `/view-category/${data._id}`, ...data}
            })
        }
        return res.status(200).json({searches:searchProvider })
 
}