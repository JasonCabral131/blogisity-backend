const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./../model/user");
exports.authenticator = async(req, res, next) => {
    try{
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const user = await jwt.verify(token, process.env.JWT_SECRET);
            if (!user) {
                return res.status(400).json({msg: "Invalid User"})
            }else{
                
                const userInfo = await User.findOne({ email: user.email });
                if(!userInfo){
                    console.log("nganhi na error deri ngadi userinfo");
                    return res.status(400).json({msg: "Invalid User"})
                }
                if( userInfo.status > 2){
                    console.log("nganhi na error deri ngadi status");
                    return res.status(400).json({msg: "Invalid User"})
                }
                const isPassword = await bcrypt.compare(
                    user.password,
                    userInfo.password
                  );
                if(!isPassword)  {
                    
                    return res.status(400).json({msg: "Invalid User"});
                }
                req.user = user
               next();
            }
           
        }else{
            return res.status(400).json({msg: "Invalid User"})
        }
    }catch(e){
        return res.status(400).json({msg: "Invalid User"})
    }
}

exports.CurrentUser = async(req, res) => {
    try{
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const user = await jwt.verify(token, process.env.JWT_SECRET);
            if (user) {
                const user = await User.findOne({ _id: user._id }).select("-passwordToken -password").lean();
                if(user){
                    return res.status(400).json({msg: "Welcome User", token, user})
                }
                return res.status(400).json({msg: "Invalid User"})
            }
            return res.status(400).json({msg: "Invalid User"})
        }else{
            return res.status(400).json({msg: "Invalid User"})
        }
    }catch(e){
        return res.status(400).json({msg: "Invalid User"})
    }
}