const DB = require("../Mongoose");

const drop = async () => {
  await DB.Connect();
  await DB.mongoose.connection.db.dropCollection("users");
  await DB.mongoose.connection.db.dropCollection("conversations");
  await DB.mongoose.connection.db.dropCollection("messages");
  await DB.Close();
};

drop();