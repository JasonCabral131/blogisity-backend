const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: "Title is Required"
    },
    content:{
        type: String,
        default: "",
    },
    headingImg: {
        url: { type: String, default: null },
        cloudinary_id: { type: String, default: null },
    },
    gallery:[
       { url: { type: String, default: null },
        cloudinary_id: { type: String, default: null },}
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        default: null,
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                default: null,
            },
            parentComment: {
                type: String,
                default: null
            },
            comment:{
                type: String,
            },
            files: [
                {
                    url: { type: String, default: null },
                    cloudinary_id: { type: String, default: null },
                } 
            ]
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    }

}, {timestamps: true})

module.exports = mongoose.model("blog", BlogSchema);

