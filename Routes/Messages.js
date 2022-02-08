const router = require("express").Router();
const Collection = require("../Models/CollectionMessage");
const CollectionConversation = require("../Models/CollectionConversation");
const verifyToken = require("../Middlewares/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  try {
    // Query messages & populate references
    const Messages = await Collection.find({})
      .populate("sender", { password: 0 })
      .populate("conversation")
      .sort({ updatedAt: "asc" });

    res.status(200).json(Messages);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.get("/:conversation_id", verifyToken, async (req, res) => {
  const { conversation_id } = req.params;
  try {
    // Query messages & populate references
    const Messages = await Collection.find({
      conversation: { _id: conversation_id },
    })
      .populate("sender", { password: 0 })
      .populate("conversation")
      .sort({ updatedAt: "asc" });

    res.status(200).json(Messages);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/create", verifyToken, async (req, res) => {
  const { text, conversation_id } = req.body;
  try {
    // Verifying required fields
    if (!text) {
      throw "Message is needed.";
    }

    if (!conversation_id) {
      throw "Conversation ID is needed.";
    }

    const senderID = req.user._id;
    // Store message in the db
    const NewMessage = new Collection({
      text,
      conversation: { _id: conversation_id },
      sender: { _id: senderID },
    });

    await NewMessage.save();

    // Update last message in the conversation collection
    await CollectionConversation.updateOne(
      { _id: conversation_id },
      {
        $set: {
          updatedAt: new Date().toUTCString(),
          lastMessage: { _id: NewMessage._id },
        },
      }
    );

    // Query messages & populate references
    const Message = await Collection.findOne({
      _id: NewMessage._id,
    })
      .populate("sender", { password: 0 })
      .populate("conversation");
    res.status(200).json(Message);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
