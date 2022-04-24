const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const config = require("config");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e8 });

app.use(express.json({ extended: true }));
app.use("/api/authorization", require("./routes/authorization.router"));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

let usersInRoom = [];

io.on("connection", (socket) => {
  console.log(`new connection: socket ${socket.id}`);
  console.log(
    `All connections: ${Array.from(io.sockets.sockets).map(
      (socket) => socket[0]
    )}`
  );

  //== chat listeners
  socket.on("user entered", (nickname) => {
    const enteredUser = nickname;
    const userSocketId = socket.id;

    console.log(`${nickname} entered the chat, his socket: ${userSocketId}`);

    usersInRoom.push([enteredUser, userSocketId, false]);
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

  socket.on("i'm not in chat", (nickname) => {
    if (usersInRoom.some((user) => user[1] === socket.id)) {
      console.log(
        `user ${nickname} presents in chat and will be removed from chat list of users`
      );

      usersInRoom = usersInRoom
        .filter((user) => {
          return user[1] !== socket.id;
        })
        .sort();

      socket.broadcast.emit("user disconnected", nickname, usersInRoom);
      console.log(`${nickname} left the chat, his socket: ${socket.id}`);
    }
  });

  socket.on("user send message", (nickname, message) => {
    socket.emit("message from user", nickname, message);
    socket.broadcast.emit("message from user", nickname, message);
  });

  socket.on("getting users socketid", (nickname) => {
    const targetUser = usersInRoom.filter((user) => {
      return user[0] === nickname;
    });

    socket.emit("getting private user data", targetUser);
  });

  socket.on(
    "user send private message",
    (nickname, privatemessage, privateUserNick, privateUserSocket) => {
      if (!usersInRoom.flat().includes(privateUserNick)) {
        console.log(`${nickname}, user ${privateUserNick} in not in chat.`);

        return socket.emit(
          "private message recipient not in chat",
          privateUserNick
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

  socket.on("user is AFK", (nickname) => {
    usersInRoom = usersInRoom.map((user) => {
      if (user[0] === nickname) {
        user[2] = true;
        return user;
      } else return user;
    });

    socket.emit("user's status is AFK", nickname, usersInRoom);
    socket.broadcast.emit("user's status is AFK", nickname, usersInRoom);
  });

  socket.on("user is not AFK", (nickname) => {
    usersInRoom = usersInRoom.map((user) => {
      if (user[0] === nickname) {
        user[2] = false;
        return user;
      } else return user;
    });

    socket.emit("user's status is not AFK", nickname, usersInRoom);
    socket.broadcast.emit("user's status is not AFK", nickname, usersInRoom);
  });

  socket.on("user send image", (nickname, image) => {
    console.log(`${nickname} send image...`);

    socket.emit("user send image only message", nickname, image);
    socket.broadcast.emit("user send image only message", nickname, image);
  });

  socket.on("user send message with image", (nickname, image, message) => {
    console.log(`${nickname} send message with image...`);

    socket.emit("user send message with image", nickname, image, message);
    socket.broadcast.emit(
      "user send message with image",
      nickname,
      image,
      message
    );
  });

  socket.on(
    "user send private image",
    (nickname, privateImage, privateUserNick, privateUserSocket) => {
      if (!usersInRoom.flat().includes(privateUserNick)) {
        console.log(`${nickname}, user ${privateUserNick} in not in chat.`);

        return socket.emit(
          "private message recipient not in chat",
          privateUserNick
        );
      }

      socket.emit("private image notification", privateUserNick, privateImage);

      io.to(privateUserSocket).emit(
        "private image from user",
        nickname,
        privateImage
      );
    }
  );

  socket.on(
    "user send private message with image",
    (
      nickname,
      privateImage,
      privatemessage,
      privateUserNick,
      privateUserSocket
    ) => {
      if (!usersInRoom.flat().includes(privateUserNick)) {
        console.log(`${nickname}, user ${privateUserNick} in not in chat.`);

        return socket.emit(
          "private message recipient not in chat",
          privateUserNick
        );
      }

      socket.emit(
        "private message with image notification",
        privateUserNick,
        privateImage,
        privatemessage
      );

      io.to(privateUserSocket).emit(
        "private message with image from user",
        nickname,
        privateImage,
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
