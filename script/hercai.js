const axios = require("axios");

module.exports.config = {
  name: "hercai",
  version: "1.0.0",
  hasPermission: 0,
  usePrefix: false,
  aliases: [],
  description: "Chat with Hercai GPT-4",
  usages: "hercai [your prompt]",
  credits: "LorexAi",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("❌ Please enter a prompt.", event.threadID, event.messageID);

  const loading = `🔍 "${prompt}"...`;

  api.sendMessage(loading, event.threadID, async (err, info) => {
    try {
      const res = await axios.get(`https://daikyu-api.up.railway.app/api/hercai-gpt-4?ask=${encodeURIComponent(prompt)}`);
      const reply = res.data?.response || "❌ No response.";

      api.editMessage(reply, info.messageID);
    } catch (e) {
      console.error(e);
      api.editMessage("❌ Error while generating response.", info.messageID);
    }
  });
};
