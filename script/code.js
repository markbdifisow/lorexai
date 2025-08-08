const db = require('../db');

module.exports.config = {
  name: 'code',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  description: 'Redeem your virtual money using a code',
  usages: 'code <your_code>',
  credits: 'LorexAi',
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const uid = event.senderID;
  const code = args[0];

  if (!code) {
    return api.sendMessage(
      '❗ Please provide a code.\n\nExample: code ABCD1234',
      event.threadID,
      event.messageID
    );
  }

  const success = await db.redeemCode(uid, code.toUpperCase());
  if (success) {
    return api.sendMessage(
      `🎉 Code redeemed successfully!\n\n₱10,000 has been added to your balance.`,
      event.threadID,
      event.messageID
    );
  } else {
    return api.sendMessage(
      `❌ Invalid or already used code. Make sure you typed it correctly.`,
      event.threadID,
      event.messageID
    );
  }
};
