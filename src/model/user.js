const mongoose = require("mongoose");
const {validateEmail} = require("./../middleware/common.middleware")
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is Required",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    profile: {
      url: { type: String, default: null },
      cloudinary_id: { type: String, default: null },
    },
    background: {
      url: { type: String, default: null },
      cloudinary_id: { type: String, default: null },
    },
    onboarding: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    address: {
      type: String,
      default: null,
    },
    lattitude: {
      type: String,
      default: null,
    },
    longitude: {
      type: String,
      default: null,
    },
    contact: { type: String, default: null },
    gender:{
      type: String,
    },
    passwordToken: { type: String, default: null },
    password: {
      type: String,
      default: null,
    },
    status: {
        type: Number,
        enum: [0, 1, 2, 3], // 0 - banned to post , 1 = regular, 2 = super admin
        default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema)