const Mongoose = require("mongoose");

const Message = Mongoose.model(
  "messages",
  new Mongoose.Schema(
    {
      text: { type: String, required: true },
      conversation: { type: Mongoose.Schema.Types.ObjectId, ref: "conversations" },
      sender: { type: Mongoose.Schema.Types.ObjectId, ref: "users" },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Message;
