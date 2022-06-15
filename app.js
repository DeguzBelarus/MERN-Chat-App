require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
const { ExpressPeerServer } = require("peer");

const app = express();
const server = createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e8 });
const peerServer = ExpressPeerServer(server, { debug: true });

app.use("/peerjs", peerServer);
app.use(express.json({ extended: true }));
app.use("/api/authorization", require("./routes/authorization.router"));

const PORT = process.env.PORT || 5000;
const DB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@maincluster.0cb8h.mongodb.net/chatDB?retryWrites=true&w=majority`;

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

let usersInRoom = [];
let usersInVideoRoom = [];

io.on("connection", (socket) => {
  console.log(`New websocket connection: socket ${socket.id}`);
  console.log(
    `All websocket connections: ${Array.from(io.sockets.sockets).map(
      (socket) => socket[0]
    )}`
  );

  //== chat listeners

  socket.on("getting all users in chats", () => {
    socket.emit(
      "number of users in all chats",
      usersInRoom.length,
      usersInVideoRoom.length
    );
  });

  //== connection and disconnection listenings
  //== connection listening
  socket.on("user entered", (nickname) => {
    const enteredUser = nickname;
    const userSocketId = socket.id;

    console.log(`${nickname} entered the chat, his socket: ${userSocketId}`);

    usersInRoom.push([enteredUser, userSocketId, false]);
    usersInRoom = usersInRoom.sort();

    socket.emit("entered user info", enteredUser, usersInRoom);
    socket.broadcast.emit("entered user info", enteredUser, usersInRoom);
    socket.broadcast.emit(
      "number of users in all chats",
      usersInRoom.length,
      usersInVideoRoom.length
    );
  });
  //== connection listening

  //== disconnection listening
  socket.on("disconnect", (data) => {
    const disconnectedUser = usersInRoom
      .filter((user) => {
        return user[1] === socket.id;
      })
      .flat();

    console.log("Websocket disconnection socket id: ", socket.id);

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
    socket.broadcast.emit(
      "number of users in all chats",
      usersInRoom.length,
      usersInVideoRoom.length
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
    socket.broadcast.emit(
      "number of users in all chats",
      usersInRoom.length,
      usersInVideoRoom.length
    );
  });
  //== disconnection listening
  //== connection and disconnection listenings

  //== defining a user for personal correspondence
  socket.on("getting users socketid", (nickname) => {
    const targetUser = usersInRoom.filter((user) => {
      return user[0] === nickname;
    });

    socket.emit("getting private user data", targetUser);
  });
  //== defining a user for personal correspondence

  //== message listenings
  //== not private
  socket.on("user send message", (nickname, message) => {
    socket.emit("message from user", nickname, message);
    socket.broadcast.emit("message from user", nickname, message);
  });
  //== not private

  //== private
  socket.on(
    "user send private message",
    (nickname, privatemessage, privateUserNick, privateUserSocket) => {
      if (!usersInRoom.flat().includes(privateUserNick)) {
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
  //== private

  //== messages with files
  //== not private
  socket.on("user send image", (nickname, image) => {
    socket.emit("user send image only message", nickname, image);
    socket.broadcast.emit("user send image only message", nickname, image);
  });

  socket.on("user send video", (nickname, video) => {
    socket.emit("user send video only message", nickname, video);
    socket.broadcast.emit("user send video only message", nickname, video);
  });

  socket.on("user send message with image", (nickname, image, message) => {
    socket.emit("user send message with image", nickname, image, message);
    socket.broadcast.emit(
      "user send message with image",
      nickname,
      image,
      message
    );
  });

  socket.on("user send message with video", (nickname, video, message) => {
    socket.emit("user send message with video", nickname, video, message);
    socket.broadcast.emit(
      "user send message with video",
      nickname,
      video,
      message
    );
  });
  //== not private

  //== private
  socket.on(
    "user send private image",
    (nickname, privateImage, privateUserNick, privateUserSocket) => {
      if (!usersInRoom.flat().includes(privateUserNick)) {
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
    "user send private video",
    (nickname, privateVideo, privateUserNick, privateUserSocket) => {
      if (!usersInRoom.flat().includes(privateUserNick)) {
        return socket.emit(
          "private message recipient not in chat",
          privateUserNick
        );
      }

      socket.emit("private video notification", privateUserNick, privateVideo);

      io.to(privateUserSocket).emit(
        "private video from user",
        nickname,
        privateVideo
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

  socket.on(
    "user send private message with video",
    (
      nickname,
      privateVideo,
      privatemessage,
      privateUserNick,
      privateUserSocket
    ) => {
      if (!usersInRoom.flat().includes(privateUserNick)) {
        return socket.emit(
          "private message recipient not in chat",
          privateUserNick
        );
      }

      socket.emit(
        "private message with video notification",
        privateUserNick,
        privateVideo,
        privatemessage
      );

      io.to(privateUserSocket).emit(
        "private message with video from user",
        nickname,
        privateVideo,
        privatemessage
      );
    }
  );
  //== private
  //== messages with files
  //== message listenings

  //== AFK status listenings
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
  //== AFK status listenings
  //== chat listeners

  //== videochat listeners
  //== connection listening
  peerServer.on("connection", (client) => {
    console.log(`New peer connection: peer ${client.id}`);
  });

  socket.on("user started stream", (peerId, nickname, poster) => {
    if (
      usersInVideoRoom.some((user) => {
        if (user[0] === nickname) {
          return true;
        }
      })
    ) {
      usersInVideoRoom.map((user) => {
        if (user[0] === nickname) {
          user[2] = poster;
          return user;
        } else {
          return;
        }
      });
    } else {
      const streamingUser = [nickname, peerId, poster];
      usersInVideoRoom.push(streamingUser);
    }

    console.log(usersInVideoRoom);

    socket.broadcast.emit(
      "number of users in all chats",
      usersInRoom.length,
      usersInVideoRoom.length
    );

    socket.broadcast.emit("updated list of broadcasts", usersInVideoRoom);
  });
  //== connection listening

  //== disconnection listening
  peerServer.on("disconnect", (client) => {
    usersInVideoRoom = usersInVideoRoom.filter((user) => user[1] !== client.id);
    console.log(`Peer disconnection: peer ${client.id}`);
    console.log(usersInVideoRoom);

    socket.broadcast.emit(
      "number of users in all chats",
      usersInRoom.length,
      usersInVideoRoom.length
    );

    socket.broadcast.emit("updated list of broadcasts", usersInVideoRoom);
  });

  socket.on("user is not streaming", (nickname) => {
    usersInVideoRoom = usersInVideoRoom.filter((user) => user[0] !== nickname);
    console.log(usersInVideoRoom);

    socket.broadcast.emit(
      "number of users in all chats",
      usersInRoom.length,
      usersInVideoRoom.length
    );

    socket.broadcast.emit("updated list of broadcasts", usersInVideoRoom);
  });
  //== disconnection listening

  //== service listenings
  socket.on("user getting list of users in videochat", () => {
    console.log("User entered in video chat");
    socket.emit("response of list of users in videochat", usersInVideoRoom);
  });
  //== service listenings
  //== videochat listeners
});

const start = async () => {
  try {
    mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    console.log("Server error:", e.message);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`);
  });
};
start();
