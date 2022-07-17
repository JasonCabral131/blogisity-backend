const express = require("express");
const mongoose = require('mongoose')
const path = require("path");
const  cors = require( "cors");
const PORT = process.env.PORT || 8000;
const app = express();
require("dotenv").config();
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "/src/uploads")));
app.use(cors());
app.use(express.json());
app.use('/api', require("./src/routes/index"));
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
    const server = app.listen(PORT, async() => {
        console.log(`7/11 backend running in Port: http://localhost:${PORT} `);
      });
      //socket connection
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "DELETE", "PUT"],
    },
  });
  require("./src/config/socket.server")(io);
})
