
const User = require("./../model/user");
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
require("dotenv").config();
const userAdmin = async() => {
      try{
        let profile = {url: "", cloudinary_id: ""};
        const user = new User({
            name : "Jason Cabral",
            email : "jasoncabral329@gmail.com",
            password: await bcrypt.hash("password",10) ,
            address: "Dagami Leyte",
            lattitude: "",
            longitude: "",
            contact: "09959524131",
            gender: "Male",
            profile,
            onboarding: 1,
            status: 2
            
        })
        const saved = await user.save();
        console.log(saved);
      }catch(err){
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
        } else {
            console.error(err);
        }
      }
     
}


mongoose.connect(process.env.MONG0_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

mongoose.connection.on(
    "error",
    console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", async() => {
    console.log("connected to mongoDb");
    await userAdmin();
})
