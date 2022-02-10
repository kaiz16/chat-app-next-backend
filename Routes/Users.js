const router = require("express").Router();
const comparePassword = require("../Helpers/comparePassword");
const generateToken = require("../Helpers/generateToken");
const generateHash = require("../Helpers/hashPassword");
const verifyToken = require("../Middlewares/verifyToken");
const Collection = require("../Models/CollectionUser");

router.get("/", async (req, res) => {
  const { search } = req.query;
  try {
    // Query users without password field
    const Users = await Collection.find(
      {
        username: new RegExp(search, "i"),
      },
      { password: 0 }
    );

    res.status(200).json(Users);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/whoami", verifyToken, async (req, res) => {
  const { user } = req;
  try {
    // Query user without password field
    const User = await Collection.findOne(
      { username: user.username },
      { password: 0 }
    );

    res.status(200).json(User);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    // Verifying required fields
    if (!username) {
      throw "Username is needed.";
    }

    // Query user without password field
    const User = await Collection.findOne({ username }, { password: 0 });

    res.status(200).json(User);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/verify-token", verifyToken, async (req, res) => {
  res.status(200).json({
    name: "JsonWebToken",
    message: "valid token",
  });
});

// Sign up
router.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    // Verifying required fields
    if (!name) {
      throw "Name is needed.";
    }

    if (!username) {
      throw "Username is needed.";
    }

    if (!email) {
      throw "Email is needed.";
    }

    if (!password) {
      throw "Password is needed.";
    }

    // Generate hashed password
    const Hash = await generateHash(password);

    // Create & store user in the db
    const Response = new Collection({
      name,
      username,
      email,
      password: Hash,
    });

    await Response.save();

    const User = Response.toJSON();

    // Generate JWT token
    const Token = await generateToken(User);
    if (!Token) {
      throw "Error generating token.";
    }

    res.status(200).json({
      jwt: Token,
    });
  } catch (error) {
    console.log(error);
    if (error && error.code === 11000) {
      res
        .status(400)
        .json(`${Object.keys(error.keyPattern)[0]} already exist.`);
      return;
    }
    res.status(400).json(error);
  }
});

// Authenticate
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verifying required fields
    if (!email) {
      throw "Email is needed.";
    }

    if (!password) {
      throw "Password is needed.";
    }

    // Find user in the db
    const Response = await Collection.findOne({ email });
    if (!Response) {
      throw "You don't have an account yet. Please register first.";
    }

    const User = Response.toJSON();

    // Compare passwords
    const Result = await comparePassword(User.password, password);
    if (!Result) {
      throw "Wrong password.";
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
      throw "Name is needed.";
    }

    if (!username) {
      throw "Username is needed.";
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
      throw "Username is needed.";
    }

    // Delete user
    await Collection.deleteOne({ username });

    res.status(200).json("Ok");
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
