const db = require("../db");

module.exports.config = {
  name: "spin",
  version: "2.0.0",
  hasPermission: 0,
  usePrefix: false,
  aliases: [],
  description: "Spin the slot machine for a chance to win credits.",
  usages: "spin",
  credits: "LorexAi",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const uid = event.senderID;
  const balance = await db.getBalance(uid);
  const fixedBet = 100;

  if (balance < fixedBet) {
    return api.sendMessage("❗ You need at least ₱100 to spin. Use `new` to get a redeem code if you're broke.", event.threadID, event.messageID);
  }

  api.sendMessage("🎰 Spinning...", event.threadID, async (err, info) => {
    if (err) return;

    await new Promise(res => setTimeout(res, 2500));

    const symbols = ["🍒", "🍋", "🍉", "🍇", "🍊"];
    const slot = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => symbols[Math.floor(Math.random() * symbols.length)]));
    const flat = slot.flat();
    const [s1, s2, s3, s4] = flat;

    const winChance = Math.random();
    let winnings = 0;
    let resultMsg = "";
    let isWin = false;

    if (winChance <= 0.8) {
      if (s1 === s2 && s2 === s3 && s3 === s4) {
        winnings = 5000;
        resultMsg = `🎉 JACKPOT x4 match!`;
      } else if (s1 === s2 && s2 === s3) {
        winnings = 400;
        resultMsg = `🎉 x3 match!`;
      } else if (s1 === s2) {
        winnings = 200;
        resultMsg = `🎉 x2 match!`;
      } else {
        winnings = 150;
        resultMsg = `🎉 Lucky Win!`;
      }

      await db.addBalance(uid, winnings);
      await db.logSpin(uid, "Win", winnings);
      isWin = true;
    } else {
      await db.deductBalance(uid, fixedBet);
      await db.logSpin(uid, "Lose", fixedBet);
    }

    const grid = slot.map(row => row.join(" | ")).join("\n");
    let message = `${grid}\n\n`;

    if (isWin) {
      message += `${resultMsg}\n\nYou won ₱${winnings.toLocaleString()} credits!`;
    } else {
      message += `❌ No match! You lost ₱${fixedBet.toLocaleString()} credits.`;
    }

    if (info?.messageID) api.unsendMessage(info.messageID);
    api.sendMessage(message, event.threadID);
  });
};
