// server/controllers/certNotifyController.js
const { ObjectId } = require('mongodb');
const ParseModel = require('../models/SkillCertificate'); // or create a Parse model

exports.notify = async (req, res) => {
  const { doc_id, parse } = req.body;
  try {
    // store parse in node/mongo (or just link to parse collection)
    // example: update user's certificates list
    const userId = (await getDocUserId(doc_id)); // you can read documents collection
    await SkillCertificate.create({
      userId: userId,
      docId: doc_id,
      parsed: parse,
      status: 'processed'
    });
    // optionally: compute quick verification checks (name fuzzy match)
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
