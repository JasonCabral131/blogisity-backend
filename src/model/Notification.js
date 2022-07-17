const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    message: {
        type:String,
        default: "",
    },
    url:{
       type: String,
       default: "",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    }
}, {timestamps: true})

module.exports = mongoose.model("notification", NotificationSchema)