const { SkillCertificate } = require('../models');
const Blockchain = require('../utils/blockchain');

const blockchain = new Blockchain();

exports.verifySkill = async (req, res) => {
  try {
    const certificate = await SkillCertificate.findById(req.params.id);
    const isValid = blockchain.verifyChain();
    
    if (isValid) {
      res.json({ verified: true, certificate });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
};