const mongoose = require("mongoose");

const FollowerSChema = new mongoose.Schema({
    following:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    }
}, {timestamps: false})

module.exports =  mongoose.model("followers", FollowerSChema)