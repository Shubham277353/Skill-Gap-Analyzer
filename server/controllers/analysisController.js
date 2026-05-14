const User = require('../models/User');
const JobRole = require('../models/JobRole');
const LearningPath = require('../models/LearningPath');
const groq = require('../config/groq');
const pdfParse = require('pdf-parse');

// Fuzzy match: does userSkill name cover requiredSkill?
const skillMatches = (userSkill, reqSkill) =>
  userSkill.toLowerCase().includes(reqSkill.toLowerCase()) ||
  reqSkill.toLowerCase().includes(userSkill.toLowerCase());

exports.analyzeSkills = async (req, res) => {
  try {
    let { name, email, currentSkills, targetRole } = req.body;
    let resumeText = req.body.resumeText || '';

    if (typeof currentSkills === 'string') {
      try { currentSkills = JSON.parse(currentSkills); }
      catch (e) { currentSkills = currentSkills.split(',').map(s => s.trim()); }
    }

    const skillNames = Array.isArray(currentSkills)
      ? currentSkills.map(s => (typeof s === 'object' ? s.name : s)).filter(Boolean)
      : [];

    if (req.file) {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    }

    let assessmentResult = null;
    if (req.body.assessmentResult) {
      try { assessmentResult = JSON.parse(req.body.assessmentResult); } catch (e) {}
    }

    const user = new User({ name, email, currentSkills: skillNames, targetRole, resumeText });
    await user.save();

    const jobRole = await JobRole.findOne({ title: targetRole });
    if (!jobRole) return res.status(404).json({ error: 'Job role not found' });

    const requiredSkills = jobRole.requiredSkills;
    const skillBreakdown = assessmentResult?.skillBreakdown || {};

    // ── Build Final Skill Profile ──────────────────────────────────────────────
    // For every required skill, determine its status:
    //   Verified   — user declared it AND test score ≥ 50%
    //   Declared   — user declared it but no test data for it
    //   Discovered — user did NOT declare it but test score ≥ 50%
    //   Weak       — test score < 40% (regardless of declaration)
    //   Missing    — not declared, no test data or test score < 50%

    const finalSkillProfile = {};

    requiredSkills.forEach(reqSkill => {
      const userDeclared = skillNames.some(u => skillMatches(u, reqSkill));

      // Find matching test skill (fuzzy)
      const testSkillKey = Object.keys(skillBreakdown).find(k => skillMatches(k, reqSkill));
      const testData = testSkillKey ? skillBreakdown[testSkillKey] : null;
      const testPct = testData ? testData.proficiency : null;

      if (testPct !== null && testPct < 40) {
        finalSkillProfile[reqSkill] = 'Weak';
      } else if (userDeclared && testPct !== null && testPct >= 50) {
        finalSkillProfile[reqSkill] = 'Verified';
      } else if (!userDeclared && testPct !== null && testPct >= 50) {
        finalSkillProfile[reqSkill] = 'Discovered';
      } else if (userDeclared) {
        finalSkillProfile[reqSkill] = 'Declared';
      } else {
        finalSkillProfile[reqSkill] = 'Missing';
      }
    });

    // ── Recalculate Match Score ────────────────────────────────────────────────
    // Only Verified, Discovered, and Declared count as "covered"
    const coveredSkills = requiredSkills.filter(s =>
      ['Verified', 'Discovered', 'Declared'].includes(finalSkillProfile[s])
    );
    const matchScore = Math.round((coveredSkills.length / requiredSkills.length) * 100);

    // Strengths = Verified + Discovered + Declared
    const strengths = coveredSkills;

    // Missing skills = Weak + Missing, categorized by priority
    const weakSkills    = requiredSkills.filter(s => finalSkillProfile[s] === 'Weak');
    const missingSkills = requiredSkills.filter(s => finalSkillProfile[s] === 'Missing');
    const allGapSkills  = [...weakSkills, ...missingSkills];

    const total = allGapSkills.length;
    const categorizedMissing = {
      critical: allGapSkills.slice(0, Math.ceil(total * 0.4)),
      important: allGapSkills.slice(Math.ceil(total * 0.4), Math.ceil(total * 0.75)),
      optional: allGapSkills.slice(Math.ceil(total * 0.75))
    };

    // ── Gap Level ──────────────────────────────────────────────────────────────
    let gapLevel = 'High';
    if (matchScore >= 80) gapLevel = 'Low';
    else if (matchScore >= 50) gapLevel = 'Moderate';

    // ── Career Level ───────────────────────────────────────────────────────────
    let careerLevel = 'Beginner';
    if (matchScore >= 70 && (!assessmentResult || assessmentResult.percentage >= 70)) careerLevel = 'Advanced';
    else if (matchScore >= 40 && (!assessmentResult || assessmentResult.percentage >= 40)) careerLevel = 'Intermediate';

    const aiConfidence = Math.min(95, Math.round(55 + (matchScore * 0.25) + (skillNames.length * 1.5)));

    // ── Skill Coverage (for coverage grid) ────────────────────────────────────
    const skillCoverage = requiredSkills.map(reqSkill => {
      const status = finalSkillProfile[reqSkill];
      const testSkillKey = Object.keys(skillBreakdown).find(k => skillMatches(k, reqSkill));
      const testData = testSkillKey ? skillBreakdown[testSkillKey] : null;
      return {
        skill: reqSkill,
        covered: ['Verified', 'Discovered', 'Declared'].includes(status),
        level: testData ? Math.round(testData.proficiency / 20) : (status === 'Declared' ? 3 : 0),
        status
      };
    });

    // ── AI Skill Insights ──────────────────────────────────────────────────────
    const discoveredSkills = requiredSkills.filter(s => finalSkillProfile[s] === 'Discovered');
    const verifiedSkills   = requiredSkills.filter(s => finalSkillProfile[s] === 'Verified');

    const insightLines = [];
    if (verifiedSkills.length > 0)
      insightLines.push(`Your declared skills in ${verifiedSkills.slice(0, 3).join(', ')} were confirmed by the test.`);
    if (discoveredSkills.length > 0)
      insightLines.push(`We discovered you have knowledge of ${discoveredSkills.join(', ')} based on your test performance — even though you didn't list ${discoveredSkills.length === 1 ? 'it' : 'them'}.`);
    if (weakSkills.length > 0)
      insightLines.push(`Your understanding of ${weakSkills.slice(0, 3).join(', ')} is weak based on test results and needs improvement.`);
    if (assessmentResult)
      insightLines.push(`If test results differ from your input, your profile has been updated accordingly.`);

    const aiSkillInsights = insightLines.join(' ');

    // ── AI Summary ─────────────────────────────────────────────────────────────
    const aiSummary = `Based on your ${skillNames.length} declared skill${skillNames.length !== 1 ? 's' : ''} and ${assessmentResult ? 'test performance' : 'skill profile'}, you match ${matchScore}% of the ${targetRole} requirements (${coveredSkills.length} of ${requiredSkills.length} skills). ${strengths.length > 0 ? `Your strongest area is ${strengths[0]}.` : 'You currently have no matched skills for this role.'} ${allGapSkills.length > 0 ? `Focus on ${categorizedMissing.critical[0] || allGapSkills[0]} first as it is critical for this role.` : 'You have all the required skills for this role!'}`;

    // ── Roadmap via AI ─────────────────────────────────────────────────────────
    let roadmap = [];
    let recommendedCertifications = [];

    // Prioritize: weak skills first, then missing
    const prioritizedGaps = [
      ...weakSkills.map(s => `${s} (Weak — needs improvement)`),
      ...missingSkills.map(s => `${s} (Missing)`)
    ];

    try {
      const prompt = `You are an AI career advisor. Analyze this profile and return a JSON learning roadmap.

Target Role: ${targetRole}
Declared Skills: ${skillNames.join(', ') || 'None'}
Verified Skills (declared + test confirmed): ${verifiedSkills.join(', ') || 'None'}
Discovered Skills (found via test): ${discoveredSkills.join(', ') || 'None'}
Weak Skills (test score < 40%): ${weakSkills.join(', ') || 'None'}
Missing Skills: ${missingSkills.join(', ') || 'None'}
Match Score: ${matchScore}%
${assessmentResult ? `Test Score: ${assessmentResult.percentage}% (${assessmentResult.skillLevel})` : 'No test taken'}

IMPORTANT: Prioritize weak skills FIRST in the roadmap (they need fixing before moving forward), then missing skills.

Return ONLY this JSON structure:
{
  "roadmap": [
    {
      "month": "Month 1",
      "focus": "brief focus area",
      "tasks": [
        {"title": "task description", "difficulty": "Easy", "estimatedTime": "1 week", "skill": "SkillName"},
        {"title": "task description", "difficulty": "Medium", "estimatedTime": "2 weeks", "skill": "SkillName"}
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

      // Fallback: weak skills first, then missing
      const chunks = [];
      for (let i = 0; i < prioritizedGaps.length; i += 2)
        chunks.push(prioritizedGaps.slice(i, i + 2));

      roadmap = chunks.slice(0, 3).map((chunk, i) => ({
        month: `Month ${i + 1}`,
        focus: i === 0 ? 'Fix weak areas' : 'Build missing skills',
        tasks: [
          { title: `Strengthen ${chunk[0].split(' (')[0]}`, difficulty: i === 0 ? 'Easy' : 'Medium', estimatedTime: '2 weeks', skill: chunk[0].split(' (')[0] },
          chunk[1]
            ? { title: `Practice ${chunk[1].split(' (')[0]}`, difficulty: 'Medium', estimatedTime: '2 weeks', skill: chunk[1].split(' (')[0] }
            : { title: 'Build a project using learned skills', difficulty: 'Hard', estimatedTime: '2 weeks', skill: 'Project' }
        ]
      }));

      if (roadmap.length === 0)
        roadmap = [{ month: 'Month 1', focus: 'Advanced practice', tasks: [{ title: 'Build advanced projects to deepen expertise', difficulty: 'Hard', estimatedTime: '4 weeks', skill: 'All' }] }];

      recommendedCertifications = certsByRole[targetRole] || ['Relevant Industry Certification', 'Online Professional Course'];
    }

    const learningPath = new LearningPath({
      userId: req.userId || user._id,
      targetRole,
      matchScore,
      careerLevel,
      missingSkills: categorizedMissing,
      roadmap: { roadmap, recommendedCertifications }
    });
    await learningPath.save();

    res.json({
      matchScore,
      gapLevel,
      strengths,
      skillCoverage,
      finalSkillProfile,
      aiSummary,
      aiSkillInsights,
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
