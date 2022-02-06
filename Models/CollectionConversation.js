const Mongoose = require("mongoose");
const CollectionMessage = require("../Models/CollectionMessage");

const Conversation = Mongoose.model(
  "conversations",
  new Mongoose.Schema(
    {
      type: { type: String, required: true },
      name: { type: String, required: true },
      participants: [{ type: Mongoose.Schema.Types.ObjectId, ref: "users" }],
      creator: { type: Mongoose.Schema.Types.ObjectId, ref: "users" },
      lastMessage: { type: Mongoose.Schema.Types.ObjectId, ref: "messages" },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Conversation;
