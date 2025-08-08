const axios = require('axios');

module.exports.config = {
  name: 'teach',
  version: '1.0.1',
  hasPermission: 0,
  usePrefix: false,
  aliases: [],
  description: "Teach the Sim new responses",
  usages: "teach [question] / [answer]",
  credits: 'DaikyuMisugi',
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args.join(" ").split("/").map(part => part.trim());

  if (input.length < 2 || !input[0] || !input[1]) {
    return api.sendMessage("❌ Usage: teach [question] / [answer]", threadID, messageID);
  }

  const [ask, ans] = input;

  try {
    const res = await axios.get(`https://hiroshi-api.onrender.com/other/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
    const msg = res.data.msg || "❌ Failed to teach.";
    api.sendMessage(`✅ ${msg}`, threadID, messageID);
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Error teaching new response.", threadID, messageID);
  }
};
