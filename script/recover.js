const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
  userID: String,
  threadID: String,
  reason: String,
  blockedAt: Date,
  expiresAt: Date
});
const BlockModel = mongoose.models.blocked_users || mongoose.model("blocked_users", BlockSchema);

module.exports.config = {
  name: "recover",
  version: "1.0.0",
  hasPermission: 0,
  usePrefix: false,
  aliases: [],
  description: "Unblock a user manually by ID",
  commandCategory: "admin",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const adminID = ["61579032975023"]; // ← Palitan mo ito ng iyong main account UID
  const senderID = event.senderID;

  if (!adminID.includes(senderID)) {
    return api.sendMessage("❌ You are not authorized to use this command.", event.threadID, event.messageID);
  }

  const targetID = args[0];
  if (!targetID || isNaN(targetID)) {
    return api.sendMessage("⚠️ Please provide a valid user ID to recover. Example:\nrecover 10009483721213", event.threadID, event.messageID);
  }

  try {
    const removed = await BlockModel.findOneAndDelete({ userID: targetID });

    if (!removed) {
      return api.sendMessage(`ℹ️ No blocked entry found for user ID ${targetID}.`, event.threadID, event.messageID);
    }

    return api.sendMessage(`✅ User ID ${targetID} has been successfully unblocked.`, event.threadID, event.messageID);
  } catch (err) {
    console.error("Recover error:", err);
    return api.sendMessage("❌ An error occurred while unblocking the user. Check console for details.", event.threadID, event.messageID);
  }
};
