const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const config = require("config");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json({ extended: true }));
app.use("/api/authorization", require("./routes/authorization.router"));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  if (!process.env.RENDER_PM_DIR) {
    app.use("/", express.static(path.join(__dirname, "client", "build")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  } else {
    app.use(
      "/",
      express.static(
        path.join(__dirname, process.env.NODE_ENV, "client", "build")
      )
    );
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }
}

let usersInRoom = [];

io.on("connection", (socket) => {
  console.log(`new connection: socket ${socket.id}`);

  //== chat listeners
  socket.on("user entered", (nickname) => {
    const enteredUser = nickname;
    const userSocketId = socket.id;

    console.log(`${nickname} entered the chat, his socket: ${userSocketId}`);

    usersInRoom.push([enteredUser, userSocketId]);
    usersInRoom = usersInRoom.sort();

    socket.emit("entered user info", enteredUser, usersInRoom);
    socket.broadcast.emit("entered user info", enteredUser, usersInRoom);
  });

  socket.on("disconnect", (data) => {
    const disconnectedUser = usersInRoom
      .filter((user) => {
        return user[1] === socket.id;
      })
      .flat();

    console.log("disconnection...", disconnectedUser);

    usersInRoom = usersInRoom
      .filter((user) => {
        return user[0] !== disconnectedUser[0];
      })
      .sort();

    socket.broadcast.emit(
      "user disconnected",
      disconnectedUser[0],
      usersInRoom
    );
  });

  socket.on("user exit", (nickname) => {
    const userSocketId = socket.id;

    console.log(`${nickname} left the chat, his socket: ${userSocketId}`);

    usersInRoom = usersInRoom
      .filter((user) => {
        return user[0] !== nickname;
      })
      .sort();

    socket.broadcast.emit("user disconnected", nickname, usersInRoom);
  });

  socket.on("user send message", (nickname, message) => {
    socket.emit("message from user", nickname, message);
    socket.broadcast.emit("message from user", nickname, message);
  });

  socket.on("getting users socketid", (nickname) => {
    const targetUser = usersInRoom.filter((element) => {
      return element[0] === nickname;
    });
    socket.emit("getting private user data", targetUser);
  });

  socket.on(
    "user send private message",
    (nickname, privatemessage, privateUserNick, privateUserSocket) => {
      if (!usersInRoom.flat().includes(privateUserNick)) {
        return console.log(
          `${nickname}, user ${privateUserNick} in not in chat.`
        );
      }

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
  //== chat listeners
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
    console.log("Server error:", e.message);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`);
  });
};

start();
