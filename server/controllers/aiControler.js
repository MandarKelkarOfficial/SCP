const natural = require('natural');
const { User, Job } = require('../models');

exports.matchJobs = async (req, res) => {
  try {
    const userSkills = req.body.profile.toLowerCase().split(' ');
    const jobs = await Job.find();
    
    const matches = jobs.map(job => {
      const jobKeywords = job.requirements.toLowerCase().split(' ');
      const intersection = userSkills.filter(skill => jobKeywords.includes(skill));
      const score = (intersection.length / jobKeywords.length) * 100;
      
      return {
        ...job._doc,
        score: score.toFixed(2)
      };
    }).sort((a, b) => b.score - a.score).slice(0, 5);

    res.json({ matches });
  } catch (error) {
    res.status(500).json({ error: 'AI matching failed' });
  }
};