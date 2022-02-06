const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const path = require("path");

const PORT = config.get("port") || 5000;

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.json({ extended: true }));
app.use("/api/authorization", require("./routes/authorization.router"));

if ((process.env.NODE_ENV = "production")) {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

let usersInRoom = [];

io.on("connection", (socket) => {
  console.log(`user connected on socket id: ${socket.id}`);

  socket.on("user connected", (data) => {
    console.log(`connection data: ${data.nickname}`);
    const connectedUser = data.nickname;
    const userSocketId = socket.id;

    console.log("entered user socket: ", userSocketId);
    usersInRoom.push([connectedUser, userSocketId]);
    usersInRoom = usersInRoom.sort();
    socket.emit("connected user info", data);
    socket.broadcast.emit("connected user info", data);

    socket.emit("users in room info", usersInRoom);
    socket.broadcast.emit("users in room info", usersInRoom);

    socket.on("disconnecting", (data) => {
      console.log("disconnection data:", connectedUser);
      usersInRoom = usersInRoom.filter((user) => {
        return user[0] !== connectedUser;
      });
      usersInRoom = usersInRoom.sort();

      socket.broadcast.emit("user disconnected", connectedUser, usersInRoom);
    });

    socket.on("user send message", (nickname, message) => {
      console.log(nickname, message);
      socket.emit("message from user", nickname, message);
      socket.broadcast.emit("message from user", nickname, message);
    });

    socket.on("getting users socketid", (nickname) => {
      const targetUser = usersInRoom.filter((element) => {
        return element[0] === nickname;
      });
      console.log("Targeted user: ", targetUser);

      socket.emit("getting private user data", targetUser);
    });

    socket.on(
      "user send private message",
      (nickname, privatemessage, privateUserNick, privateUserSocket) => {
        console.log(
          nickname,
          privatemessage,
          privateUserNick,
          privateUserSocket
        );

        socket.emit(
          "private message notification",
          privateUserNick,
          privatemessage
        );

        io.to(privateUserSocket).emit(
          "private message from user",
          nickname,
          privatemessage
        );
      }
    );
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
