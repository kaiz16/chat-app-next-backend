const MongoDB = require("../MongoDB");
const User = require("./CollectionUser");
const Conversation = require("./CollectionConversation");

const create = async () => {
  await MongoDB.Connect();
  const DB = MongoDB.database;
  try {
    await DB.dropCollection(User.collectionName);
    await DB.dropCollection(Conversation.collectionName);
  } catch (error) {
    console.error(error);
  }

  await MongoDB.Close();
};

create();
