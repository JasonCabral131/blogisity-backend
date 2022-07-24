const jwt = require("jsonwebtoken");
const User = require("./../model/user");
const bcrypt = require("bcrypt");
const {AddActiveUser} = require("./SocketController/index")
module.exports = socketServer = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;

      const user = await jwt.verify(token, process.env.JWT_SECRET);
      if (!user) {
        next(new Error("you shall not pass"));
        return;
      } else {
        const userInfo = await User.findOne({ email: user.email });
        if (!userInfo) {
          next(new Error("you shall not pass"));
          return;
        }
        if (userInfo.status > 2) {
          next(new Error("you shall not pass"));
          return;
        }
        const isPassword = await bcrypt.compare(
          user.password,
          userInfo.password
        );
        if (!isPassword) {
          next(new Error("you shall not pass"));
          return;
        }
        socket.user = user;
        next();
      }
    } catch (e) {
      console.log(e)
      next(new Error("you shall not pass"));
    }
  });
  io.on("connection", (socket) => {
    try {
     
      socket.on("disconnect", async () => {
        console.log("user has been disconnected", socket.user);
      });
      socket.on("comment-user-blog", async (data, callback) => {

      });
      socket.on("AddToActive", async (data, callback) => {
        const user = await User.findOne({ _id: socket.user._id }).select("-passwordToken -password").lean();
        if(user){
          AddActiveUser(user)
          socket.join(user._id.toString());
        }
      });
      socket.on("sending-chat-message", (data, callback) => {
          const {reciever} = data;
            console.log(data)
          io.to(reciever).emit("new-chat-message", {
            data,
          });
          console.log(socket.user._id);
          io.to(socket.user._id.toString()).emit("update-chat-message-inbox", {
            data,
          });
      })
    } catch (e) {
      console.log(e);
    }
  });
};
