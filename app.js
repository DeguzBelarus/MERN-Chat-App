const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const PORT = config.get("port") || 5000;

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.json({ extended: true }));
app.use("/api/authorization", require("./routes/authorization.router"));

io.on("connection", (socket) => {
  console.log(`user connected on socket id: ${socket.id}`);
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
