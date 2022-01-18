const Mongoose = require("mongoose");
const Conversation = mongoose.model(
  "conversation",
  new mongoose.Schema(
    {
      userName: { type: String, required: true },
      text: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  )
);
// Exporting the message model.
module.exports = messages;
