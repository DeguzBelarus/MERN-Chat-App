const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const PORT = config.get("port") || 5000;

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.json({ extended: true }));
app.use("/api/authorization", require("./routes/authorization.router"));

let usersInRoom = [];

io.on("connection", (socket) => {
  console.log(`user connected on socket id: ${socket.id}`);

  socket.on("user connected", (data) => {
    console.log(`connection data: ${data.nickname}`);
    const connectedUser = data.nickname;

    if (!usersInRoom.includes(data.nickname)) {
      let userSocketId = socket.id;
      console.log("entered user socket: ", userSocketId);
      usersInRoom.push([connectedUser, userSocketId]);
      socket.emit("connected user info", data);
      socket.broadcast.emit("connected user info", data);
    }

    socket.emit("users in room info", usersInRoom);
    socket.broadcast.emit("users in room info", usersInRoom);

    socket.on("disconnecting", (data) => {
      console.log("disconnection data:", connectedUser, typeof connectedUser);
      usersInRoom = usersInRoom.filter((element) => {
        return element[0] !== connectedUser;
      });

      socket.broadcast.emit("user disconnected", connectedUser, usersInRoom);
    });

    socket.on("user send message", (nickname, message) => {
      console.log(nickname, message);
      socket.emit("message from user", nickname, message);
      socket.broadcast.emit("message from user", nickname, message);
    });
  });
});

const start = async () => {
  try {
    await mongoose.connect(
      config.get("mongoDBurl", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    );
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }

  server.listen(5000, () => {
    console.log(`Server has been started on port ${PORT}...`);
  });
};
start();
