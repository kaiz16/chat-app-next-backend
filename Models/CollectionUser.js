
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const User = Mongoose.model(
  "users",
  new Mongoose.Schema(
    {
      name: { type: String, required: true },
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = User;
