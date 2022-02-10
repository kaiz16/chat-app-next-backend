const Express = require("express");
const CORS = require("cors");
const RoutesUser = require("./Routes/Users");
const RoutesConversation = require("./Routes/Conversations");
const RoutesMessage = require("./Routes/Messages");
const DB = require("./Mongoose");
const loadEnv = require("./loadEnv");
loadEnv();
const App = Express();
App.use(Express.json());
App.use(CORS());
const start = async () => {
  await DB.Connect();
  App.use("/users", RoutesUser);
  App.use("/conversations", RoutesConversation);
  App.use("/messages", RoutesMessage);
  App.listen(5000, () => {
    console.log(`🚀 Listening on port 5000`);
  });
  // await Server.close();
};

start();
