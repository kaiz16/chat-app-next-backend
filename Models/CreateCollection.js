const DB = require("../Mongoose");
const User = require("./CollectionUser");
const Conversation = require("./CollectionConversation");
const Message = require("./CollectionMessage");

const create = async () => {
  await DB.Connect();
  await User.createCollection();
  await Conversation.createCollection();
  await Message.createCollection();
  await DB.Close();
};

create();
