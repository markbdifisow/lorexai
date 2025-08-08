const axios = require('axios');

module.exports.config = {
  name: 'sim',
  version: '1.0.0',
  hasPermission: 0,
  usePrefix: false,
  aliases: ['simsimi', 'talk'],
  description: "Talk with a SimSimi-like AI",
  usages: "sim [message]",
  credits: 'DaikyuMisugi',
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args.join(" ").trim();

  if (!input) {
    return api.sendMessage("❌ Please say something to Sim!", threadID, messageID);
  }

  try {
    const res = await axios.get(`https://daikyu-api.up.railway.app/api/sim-simi?talk=${encodeURIComponent(input)}`);
    const reply = res.data.response || "❌ No response from Sim.";
    api.sendMessage(reply, threadID, messageID);
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Failed to get a response from Sim.", threadID, messageID);
  }
};
