const Mongoose = require("mongoose");

const Conversation = Mongoose.model(
  "conversations",
  new Mongoose.Schema(
    {
      name: { type: String, required: true },
      participants: [{ type: Mongoose.Schema.Types.ObjectId, ref: "users" }],
      creator: { type: Mongoose.Schema.Types.ObjectId, ref: "users" },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Conversation;
