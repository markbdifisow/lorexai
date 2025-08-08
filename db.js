const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected.');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

const balanceSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  amount: { type: Number, default: 0 }
});

const codeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  uid: String
});

const spinLogSchema = new mongoose.Schema({
  uid: String,
  result: String,
  amount: Number,
  time: { type: Date, default: Date.now }
});

const Balance = mongoose.model('Balance', balanceSchema);
const RedeemCode = mongoose.model('RedeemCode', codeSchema);
const SpinLog = mongoose.model('SpinLog', spinLogSchema);

async function getBalance(uid) {
  const doc = await Balance.findOne({ uid });
  return doc ? doc.amount : 0;
}

async function setBalance(uid, amount) {
  await Balance.updateOne({ uid }, { uid, amount }, { upsert: true });
}

async function addBalance(uid, amount) {
  const current = await getBalance(uid);
  await setBalance(uid, current + amount);
}

async function deductBalance(uid, amount) {
  const current = await getBalance(uid);
  await setBalance(uid, Math.max(0, current - amount));
}

async function grantInitialBalance(uid) {
  const existing = await Balance.findOne({ uid });
  if (!existing) {
    await Balance.create({ uid, amount: 10000 });
    return true;
  }
  return false;
}

async function getCode(uid) {
  const doc = await RedeemCode.findOne({ uid });
  return doc ? doc.code : null;
}

async function createCode(uid) {
  const existing = await getCode(uid);
  if (existing) return existing;
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  await RedeemCode.create({ code, uid });
  return code;
}

async function redeemCode(uid, code) {
  const doc = await RedeemCode.findOne({ code });
  if (doc && doc.uid === uid) {
    await addBalance(uid, 10000);
    await RedeemCode.deleteOne({ code });
    return true;
  }
  return false;
}

async function logSpin(uid, result, amount) {
  await SpinLog.create({ uid, result, amount });
  const logs = await SpinLog.find({ uid }).sort({ time: -1 });
  if (logs.length > 100) {
    const toDelete = logs.slice(100).map(log => log._id);
    await SpinLog.deleteMany({ _id: { $in: toDelete } });
  }
}

async function getTopBalances(limit = 10) {
  const topUsers = await Balance.find().sort({ amount: -1 }).limit(limit);
  return topUsers;
}

module.exports = {
  getBalance,
  setBalance,
  addBalance,
  deductBalance,
  createCode,
  redeemCode,
  getCode,
  logSpin,
  grantInitialBalance,
  getTopBalances
};
