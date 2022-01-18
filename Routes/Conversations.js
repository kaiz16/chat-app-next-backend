const router = require("express").Router();
const Collection = require("../Models/CollectionConversation");

router.get("/", async (req, res) => {
  try {
    // Query conversations & include relationships
    const Conversations = await Collection.find({})
      .populate("creator", { password: 0 })
      .populate("participants", { password: 0 });

    res.status(200).json(Conversations);
  } catch (error) {
    console.error(error);
    res.status(400).json("Error querying conversations");
  }
});

router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    // Query conversations & include relationships
    const Conversations = await Collection.find({
      participants: { _id: user_id },
    })
      .populate("creator", { password: 0 })
      .populate("participants", { password: 0 });

    res.status(200).json(Conversations);
  } catch (error) {
    console.error(error);
    res.status(400).json("Error querying conversations");
  }
});

router.post("/create", async (req, res) => {
  const { name, creator_id, participant_ids } = req.body;
  try {
    // Verifying required fields
    if (!name) {
      throw "Name is needed";
    }
    
    if (!creator_id) {
      throw "Creator ID is needed";
    }

    if (!participant_ids) {
      throw "Participant ID(s) are needed";
    }

    const participantIds = participant_ids
      .map((id) => {
        return { _id: id };
      })
      .filter(Boolean);

    // Store conversation in the db
    const Conversation = new Collection({
      name,
      participants: participantIds,
      creator: { _id: creator_id },
    });

    await Conversation.save();

    res.status(200).json(Conversation);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
