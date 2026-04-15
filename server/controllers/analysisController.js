const User = require('../models/User');
const JobRole = require('../models/JobRole');
const LearningPath = require('../models/LearningPath');
const groq = require('../config/groq');
const pdfParse = require('pdf-parse');

exports.analyzeSkills = async (req, res) => {
  try {
    let { name, email, currentSkills, targetRole } = req.body;
    let resumeText = req.body.resumeText || '';

    if (typeof currentSkills === 'string') {
      try {
        currentSkills = JSON.parse(currentSkills);
      } catch (e) {
        currentSkills = currentSkills.split(',').map(s => ({ name: s.trim(), level: 3 }));
      }
    }

    const skillNames = Array.isArray(currentSkills) ?
      currentSkills.map(s => typeof s === 'object' ? s.name : s) : [];
    const skillLevels = Array.isArray(currentSkills) && typeof currentSkills[0] === 'object' ?
      currentSkills : skillNames.map(name => ({ name, level: 3 }));

    if (req.file) {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    }

    // Parse assessment result if provided
    let assessmentResult = null;
    if (req.body.assessmentResult) {
      try { assessmentResult = JSON.parse(req.body.assessmentResult); } catch (e) {}
    }

    const user = new User({ name, email, currentSkills: skillNames, targetRole, resumeText });
    await user.save();

    const jobRole = await JobRole.findOne({ title: targetRole });
    if (!jobRole) return res.status(404).json({ error: 'Job role not found' });

    // Real missing skills calculation
    const matchedSkills = jobRole.requiredSkills.filter(skill =>
      skillNames.some(u => u.toLowerCase().includes(skill.toLowerCase()))
    );
    const missingSkills = jobRole.requiredSkills.filter(skill =>
      !skillNames.some(u => u.toLowerCase().includes(skill.toLowerCase()))
    );

    const matchScore = Math.round((matchedSkills.length / jobRole.requiredSkills.length) * 100);

    let gapLevel = 'High';
    if (matchScore >= 80) gapLevel = 'Low';
    else if (matchScore >= 50) gapLevel = 'Moderate';

    const avgSkillLevel = skillLevels.reduce((sum, s) => sum + s.level, 0) / skillLevels.length;
    let careerLevel = 'Beginner';
    if (matchScore >= 70 && avgSkillLevel >= 4) careerLevel = 'Advanced';
    else if (matchScore >= 40 && avgSkillLevel >= 3) careerLevel = 'Intermediate';

    const aiConfidence = Math.min(95, Math.round(55 + (matchScore * 0.25) + (skillNames.length * 1.5)));

    // Real skill coverage per required skill with user's proficiency level
    const skillCoverage = jobRole.requiredSkills.map(reqSkill => {
      const userSkill = skillLevels.find(s => s.name.toLowerCase().includes(reqSkill.toLowerCase()));
      return {
        skill: reqSkill,
        covered: !!userSkill,
        level: userSkill ? userSkill.level : 0
      };
    });

    // Categorize missing skills by position in required list (first = most critical)
    const total = missingSkills.length;
    const categorizedMissing = {
      critical: missingSkills.slice(0, Math.ceil(total * 0.4)),
      important: missingSkills.slice(Math.ceil(total * 0.4), Math.ceil(total * 0.75)),
      optional: missingSkills.slice(Math.ceil(total * 0.75))
    };

    const aiSummary = `Based on your ${skillNames.length} skill${skillNames.length !== 1 ? 's' : ''}, you match ${matchScore}% of the ${targetRole} requirements (${matchedSkills.length} out of ${jobRole.requiredSkills.length} skills). ${matchedSkills.length > 0 ? `Your strongest matched skill is ${matchedSkills[0]}.` : 'You currently have no direct skill matches for this role.'} ${assessmentResult ? `Your skill assessment score was ${assessmentResult.percentage}% (${assessmentResult.skillLevel} level).` : ''} ${missingSkills.length > 0 ? `Focus on ${categorizedMissing.critical[0] || missingSkills[0]} first as it is critical for this role.` : 'You have all the required skills for this role!'}`;

    let roadmap = [];
    let recommendedCertifications = [];

    try {
      const prompt = `You are an AI career advisor. Analyze this profile and return a JSON learning roadmap.

Target Role: ${targetRole}
User Skills: ${skillNames.join(', ')}
Missing Skills: ${missingSkills.join(', ')}
Match Score: ${matchScore}%
${assessmentResult ? `Skill Assessment Score: ${assessmentResult.percentage}% (${assessmentResult.skillLevel})
Weak Areas from Test: ${assessmentResult.weakAreas?.slice(0,3).join(', ')}` : 'No assessment taken'}

Return ONLY this JSON structure:
{
  "roadmap": [
    {
      "month": "Month 1",
      "tasks": [
        {"title": "task description", "difficulty": "Easy", "estimatedTime": "1 week"},
        {"title": "task description", "difficulty": "Medium", "estimatedTime": "2 weeks"}
      ]
    }
  ],
  "recommendedCertifications": ["cert1", "cert2", "cert3"]
}`;

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content);
      roadmap = aiResponse.roadmap || [];
      recommendedCertifications = aiResponse.recommendedCertifications || [];
    } catch (groqError) {
      console.log('Groq unavailable, using fallback roadmap');

      const certsByRole = {
        'Frontend Developer': ['Meta Front-End Developer Certificate', 'AWS Certified Developer', 'Google UX Design Certificate'],
        'Backend Developer': ['AWS Certified Solutions Architect', 'MongoDB Certified Developer', 'Oracle Java SE Certification'],
        'Full Stack Developer': ['AWS Certified Developer', 'Meta Full-Stack Engineer Certificate', 'Microsoft Azure Developer'],
        'DevOps Engineer': ['AWS Certified DevOps Engineer', 'Certified Kubernetes Administrator (CKA)', 'Docker Certified Associate'],
        'Cybersecurity Specialist': ['CompTIA Security+', 'CEH - Certified Ethical Hacker', 'CISSP', 'OSCP'],
        'Data Scientist': ['IBM Data Science Certificate', 'Google Data Analytics Certificate', 'AWS Certified ML Specialty'],
        'Machine Learning Engineer': ['TensorFlow Developer Certificate', 'AWS ML Specialty', 'Deep Learning Specialization'],
        'Cloud Architect': ['AWS Solutions Architect Professional', 'Google Cloud Professional Architect', 'Azure Solutions Architect'],
        'Mobile Developer': ['Google Associate Android Developer', 'Apple iOS Developer Certificate', 'Meta React Native Certificate'],
        'UI/UX Designer': ['Google UX Design Certificate', 'Interaction Design Foundation', 'Adobe Certified Professional'],
        'Blockchain Developer': ['Certified Blockchain Developer (CBD)', 'Ethereum Developer Certification', 'Hyperledger Certification'],
        'Data Engineer': ['Google Professional Data Engineer', 'AWS Data Analytics Specialty', 'Databricks Certified Associate']
      };

      const chunks = [];
      for (let i = 0; i < missingSkills.length; i += 2) {
        chunks.push(missingSkills.slice(i, i + 2));
      }

      roadmap = chunks.slice(0, 3).map((chunk, i) => ({
        month: `Month ${i + 1}`,
        tasks: [
          { title: `Learn ${chunk[0]}`, difficulty: i === 0 ? 'Easy' : 'Medium', estimatedTime: '2 weeks' },
          chunk[1] ? { title: `Practice ${chunk[1]}`, difficulty: 'Medium', estimatedTime: '2 weeks' } : { title: 'Build a project using learned skills', difficulty: 'Hard', estimatedTime: '2 weeks' }
        ]
      }));

      if (roadmap.length === 0) {
        roadmap = [{ month: 'Month 1', tasks: [{ title: 'Build advanced projects to deepen expertise', difficulty: 'Hard', estimatedTime: '4 weeks' }] }];
      }

      recommendedCertifications = certsByRole[targetRole] || ['Relevant Industry Certification', 'Online Professional Course'];
    }

    const learningPath = new LearningPath({
      userId: user._id,
      targetRole,
      missingSkills: categorizedMissing,
      roadmap: { roadmap, recommendedCertifications, matchScore, careerLevel }
    });
    await learningPath.save();

    res.json({
      matchScore,
      gapLevel,
      strengths: matchedSkills,
      skillCoverage,
      aiSummary,
      missingSkills: categorizedMissing,
      roadmap,
      recommendedCertifications,
      careerLevel,
      aiConfidence,
      assessmentResult,
      learningPathId: learningPath._id
    });

  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLearningPath = async (req, res) => {
  try {
    const learningPath = await LearningPath.findById(req.params.id).populate('userId');
    if (!learningPath) return res.status(404).json({ error: 'Learning path not found' });
    res.json(learningPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
