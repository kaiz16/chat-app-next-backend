const BCRYPT = require("bcrypt");
const comparePassword = async (saltPassword, password) => {
  const compare = await new Promise((resolve, reject) => {
    BCRYPT.compare(password, saltPassword, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });

  return compare;
};

module.exports = comparePassword;
