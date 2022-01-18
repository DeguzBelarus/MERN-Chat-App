const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const server = express();
const PORT = config.get("port") || 5000;

server.use(express.json({ extended: true }));
server.use("/api/authorization", require("./routes/authorization.router"));

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
