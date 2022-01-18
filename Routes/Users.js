const router = require("express").Router();
const comparePassword = require("../Helpers/comparePassword");
const generateToken = require("../Helpers/generateToken");
const generateHash = require("../Helpers/hashPassword");
const Collection = require("../Models/CollectionUser");

router.get("/", async (req, res) => {
  try {
    // Query users without password field
    const Users = await Collection.find({}, { password: 0 });
    res.status(200).json(Users);
  } catch (error) {
    res.status(400).json("Error querying users");
  }
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    // Verifying required fields
    if (!username) {
      throw "Username is needed";
    }

    // Query user without password field
    const User = await Collection.findOne({ username }, { password: 0 });
    res.status(200).json(User);
  } catch (error) {
    res.status(400).json("Error querying user");
  }
});

// Sign up
router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    // Verifying required fields
    if (!name) {
      throw "Name is needed";
    }
    if (!username) {
      throw "Username is needed";
    }
    if (!email) {
      throw "Email is needed";
    }
    if (!password) {
      throw "Password is needed";
    }

    // Generate hashed password
    const Hash = await generateHash(password);

    // Create & store user in the db
    const User = new Collection({
      name,
      username,
      email,
      password: Hash,
    });
    await User.save();

    // Remove password field
    delete User.password;
    res.status(200).json(User);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

// Authenticate
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verifying required fields
    if (!email) {
      throw "Email is needed";
    }
    if (!password) {
      throw "Password is needed";
    }

    // Find user in the db
    const Response = await Collection.findOne({ email });
    if (!Response) {
      throw "User doesn't exist.";
    }
    const User = Response.toJSON();

    // Compare passwords
    const Result = await comparePassword(User.password, password);
    if (!Result) {
      throw "Password doesn't match.";
    }

    // Generate JWT token
    const Token = await generateToken(User);
    if (!Token) {
      throw "Error generating token.";
    }
    res.status(200).json({
      jwt: Token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.put("/update/:username", async (req, res) => {
  const { username } = req.params;
  const { name } = req.body;
  try {
    // Verifying required fields
    if (!name) {
      throw "Name is needed";
    }

    if (!username) {
      throw "Username is needed";
    }

    // Update user
    await Collection.updateOne({ username }, { $set: { name } });

    // Query user without password field
    const User = await Collection.findOne({ username }, { password: 0 });
    res.status(200).json(User);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/delete/:username", async (req, res) => {
  const { username } = req.params;
  try {
    // Verifying required fields
    if (!username) {
      throw "Username is needed";
    }

    // Delete user
    await Collection.deleteOne({ username });
    res.status(200).json("Ok");
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
