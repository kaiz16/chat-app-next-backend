const DB = require("../Mongoose");
const Conversation = require("./CollectionConversation");
const User = require("./CollectionUser");

const create = async () => {
  await DB.Connect();
  await User.createCollection()
  await DB.Close()
};

create();
