const db = require('../db');

module.exports.config = {
  name: 'new',
  version: '1.0.2',
  hasPermission: 0,
  usePrefix: false,
  description: 'Generate a redeem code to get virtual money (only when balance is 0)',
  usages: 'new',
  credits: 'LorexAi',
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {
  const uid = event.senderID;

  // ✅ Ayusin ito gamit await
  const balance = await db.getBalance(uid);

  if (balance > 0) {
    return api.sendMessage(
      `❌ You still have ₱${balance.toLocaleString()} credits.\nYou can only request a new code when your balance is 0.`,
      event.threadID,
      event.messageID
    );
  }

  // ✅ Gamitin din await dito
  const code = await db.createCode(uid);

  api.sendMessage('🔄 Generating code...', event.threadID, async (err, info) => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (info?.messageID) {
      api.unsendMessage(info.messageID);
    }

    return api.sendMessage(
      `✅ Here is your code:\n🔑 ${code}\n\nUse the command:\ncode ${code} — to redeem your ₱10,000 virtual credits.`,
      event.threadID
    );
  });
};
