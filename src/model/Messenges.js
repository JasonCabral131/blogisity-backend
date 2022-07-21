const mongoose = require("mongoose");

const MessengesSchema = new mongoose.Schema({
    messenges: {
        type: String,
        default: null
    },
    photos: [
        {
            url: {default: null, type: String},
            cloudinary_id: {default: null, type: String}
        }
    ],
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    reciever:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    }
}, {timestamps: true});

module.exports = mongoose.model('messenges', MessengesSchema)