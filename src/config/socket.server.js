
const jwt = require("jsonwebtoken")
const User = require("./../model/user");

module.exports = socketServer = (io) => {
    io.use(async (socket, next) => {
        try {
          const token = socket.handshake.query.token;
    
          const user = await jwt.verify(token, process.env.JWT_SECRET);
            if (!user) {
              next(new Error("you shall not pass"));
              return;
            }else{
                
                const userInfo = await User.findOne({ email: user.email });
                if(!userInfo){
                  next(new Error("you shall not pass"));
                  return;
                }
                if( userInfo.status > 2){
                  next(new Error("you shall not pass"));
                  return;
                }
                const isPassword = await bcrypt.compare(
                    user.password,
                    userInfo.password
                  );
                if(!isPassword)  {
                  next(new Error("you shall not pass"));
                  return;
                }
                socket.user = user;
            }
        } catch (e) {
           
          next(new Error("you shall not pass"));
        }
      });
      io.on("connection", (socket) => {
        try{
            console.log("user successfully connected",socket.user )
            socket.on("disconnect", async () => {
                console.log("user has been disconnected", socket.user)
            })
            socket.on("comment-user-blog", async() => {

            })
            socket.on("AddToActive", async (data, callback) => {
              const user = await User.findOne({ _id: socket.user._id });
              console.log(user)

            })
        }catch(e){
            console.log(e);   
        }
      })
}