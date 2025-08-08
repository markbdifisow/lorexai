module.exports.config = {
  name: 'uid',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  aliases: ['id'],
  description: "Show your Facebook user ID (UID)",
  usages: "uid",
  credits: 'LorexAi',
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(`𝗬𝗼𝘂𝗿 𝗨𝗜𝗗: ${event.senderID}`, event.threadID, event.messageID);
};
