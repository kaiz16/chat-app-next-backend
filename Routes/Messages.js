const router = require("express").Router();
const Collection = require("../Models/CollectionMessage");

router.get("/", async (req, res) => {
  try {
    // Query messages & include relationships
    const Messages = await Collection.find({})
      .populate("sender", { password: 0 })
      .populate("conversation");

    res.status(200).json(Messages);
  } catch (error) {
    console.error(error);
    res.status(400).json("Error querying messages");
  }
});

router.get("/:conversation_id", async (req, res) => {
  const { conversation_id } = req.params;
  try {
    // Query messages & include relationships
    const Messages = await Collection.find({
      conversation: { _id: conversation_id },
    })
      .populate("sender", { password: 0 })
      .populate("conversation");

    res.status(200).json(Messages);
  } catch (error) {
    console.error(error);
    res.status(400).json("Error querying messages");
  }
});

router.post("/create", async (req, res) => {
  const { text, sender_id, conversation_id } = req.body;
  try {
    // Verifying required fields
    if (!text) {
      throw "Message is needed";
    }

    if (!sender_id) {
      throw "Sender ID is needed";
    }

    if (!conversation_id) {
      throw "Conversation ID is needed";
    }

    // Store message in the db
    const Message = new Collection({
      text,
      conversation: { _id: conversation_id },
      sender: { _id: sender_id },
    });

    await Message.save();

    res.status(200).json(Message);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
