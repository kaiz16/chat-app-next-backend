const router = require("express").Router();
const Collection = require("../Models/CollectionConversation");
const verifyToken = require("../Middlewares/verifyToken");

router.get("/", verifyToken, async (req, res) => {
  try {
    // Query conversations by current user & populate references
    const Conversations = await Collection.find({
      participants: { _id: req.user._id },
    })
      .populate("creator", { password: 0 })
      .populate("participants", { password: 0 })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      })
      .sort({ updatedAt: "desc" });
    res.status(200).json(Conversations);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.post("/create", verifyToken, async (req, res) => {
  const { type, name, participant_ids } = req.body;
  try {
    // Verifying required fields
    if (!type) {
      throw "Type is needed.";
    }

    if (type !== "Individual" && type !== "Group") {
      throw "Type must be either Individual or Group.";
    }

    if (!name) {
      throw "Name is needed.";
    }

    if (!participant_ids) {
      throw "Participant ID(s) are needed.";
    }
    const userID = req.user._id;

    const participantIDs = participant_ids
      .map((id) => {
        if (id !== userID) {
          return { _id: id };
        }
      })
      .filter(Boolean);

    participantIDs.push(userID);

    if (type === "Individual") {
      const Conversation = await Collection.findOne({
        participants: { _id: participantIDs[0]._id },
        creator: { _id: userID },
        type,
      })
        .populate("creator", { password: 0 })
        .populate("participants", { password: 0 })
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
            select: "-password",
          },
        });

      if (Conversation) {
        res.status(200).json(Conversation);
        return;
      }
    }

    // Store conversation in the db
    const NewConversation = new Collection({
      type,
      name,
      participants: participantIDs,
      creator: { _id: userID },
    });

    await NewConversation.save();

    const Conversation = await Collection.findOne({
      _id: NewConversation._id,
    })
      .populate("creator", { password: 0 })
      .populate("participants", { password: 0 })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
      });
    res.status(200).json(Conversation);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

module.exports = router;
