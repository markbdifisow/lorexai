module.exports.config = {
  name: "help",
  version: "1.0.0",
  hasPermission: 0,
  usePrefix: false,
  aliases: [],
  description: "Show all available commands",
  usages: "help",
  credits: "LorexAi",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const helpMessage = `
𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦

✨ AI Commands:
• ai
• ai2
• hercai
• humanize

🎨 Image:
• flux
• remini 
• pinterest 

🎵 Music:
• ytmusic

🙂 Simsimi:
• sim
• teach

🧩 Others
• uid

🎰 Scatter Game:
• new
• code
• spin
• money

📌 Scatter Game Instructions:

• To start the game use 'new' to generate a redeem code if your balance is 0.

• Use 'code [yourcode]' to redeem ₱10,000 credits.

• Use 'spin [the amount of your bet] Example: spin 100'.

• Match symbols to win rewards. jackpot gives random high credits.

• Use 'money' to check your balance.

⚠ Reminder: Scatter Game is just for fun game to cure boredom. Enjoy playing!.

  `;

  api.sendMessage(helpMessage, event.threadID, event.messageID);
};
