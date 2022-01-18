const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true, unique: true },
  user: [{ type: Types.ObjectId, ref: "Users" }],
});

module.exports = model("newUser", schema);
