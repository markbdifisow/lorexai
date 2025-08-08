const { getBalance } = require('../db');

module.exports.config = {
  name: 'money',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  description: 'Check your current balance',
  usages: 'money',
  credits: 'LorexAi',
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {
  const uid = event.senderID;
  const balance = (await getBalance(uid)).toLocaleString();

  api.sendMessage(`💰 Your current balance is:\n\n💰 ₱${balance}`, event.threadID, event.messageID);
};
