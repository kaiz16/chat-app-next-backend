const loadEnv = () => {
  if (process.env.NODE_ENV === "production") {
    require("dotenv").config({ path: __dirname + "/.env.production" });
  } else {
    require("dotenv").config({ path: __dirname + "/.env" });
  }
};
module.exports = loadEnv;
