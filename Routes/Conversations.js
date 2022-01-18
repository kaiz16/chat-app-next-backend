const router = require("express").Router();
const MongoDB = require("../Mongoose");
const DB = MongoDB.database;
const Collection = DB.collection("conversation");
router.get("/", async (req, res) => {
  try {
    // Query conversations
    const Conversations = await Collection.find({}).toArray();
    res.status(200).json(Conversations);
  } catch (error) {
    res.status(400).json("Error querying conversations");
  }
});

router.post("/create", async (req, res) => {
  const { name, userId, participantIds } = req.body;
  console.log(name, userId, participantIds);
  try {
    // Verifying required fields
    if (!name) {
      throw "Name is needed";
    }
    if (!userId) {
      throw "User ID is needed";
    }

    // if (!participantIds) {
    //   throw "Participant ID is needed";
    // }

    // Store conversation in the db
    const res = await Collection.insertOne({
      name,
      createdAt: new Date().toUTCString(),
      userId: userId,
      //   participantIds: participantIds,
    });

    console.log(res);

    // Query newly added conversation
    const Conversation = await Collection.findOne({ _id: insertedId });
    res.status(200).json(Conversation);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
