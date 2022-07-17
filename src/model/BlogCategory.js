const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const CategorySchema = new mongoose.Schema({
    id: Number,
    category:{
        type: String,
        required: "Title is required"
    },
    description: {
        type: String,
        default: ""
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    }
}, {timestamps: true})
CategorySchema.plugin(autoIncrement, { inc_field: "id" })
module.exports = mongoose.model('category', CategorySchema);