const mongoose = require("mongoose");

const RatingsSchema = new mongoose.Schema({
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    rate: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

module.exports = mongoose.model("rating",RatingsSchema)