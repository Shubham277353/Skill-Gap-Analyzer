const User = require('../models/User');
const JobRole = require('../models/JobRole');
const LearningPath = require('../models/LearningPath');
const groq = require('../config/groq');
const pdfParse = require('pdf-parse');

exports.analyzeSkills = async (req, res) => {
  try {
    let { name, email, currentSkills, targetRole } = req.body;
    let resumeText = req.body.resumeText || '';

    // Parse currentSkills - handle both array of objects and simple array
    if (typeof currentSkills === 'string') {
      try {
        currentSkills = JSON.parse(currentSkills);
      } catch (e) {
        currentSkills = currentSkills.split(',').map(s => ({ name: s.trim(), level: 3 }));
      }
    }
    
    // Extract skill names for comparison
    const skillNames = Array.isArray(currentSkills) ? 
      currentSkills.map(s => typeof s === 'object' ? s.name : s) : [];
    const skillLevels = Array.isArray(currentSkills) && typeof currentSkills[0] === 'object' ? 
      currentSkills : skillNames.map(name => ({ name, level: 3 }));

    // Extract text from PDF if uploaded
    if (req.file) {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    }

    // Create user
    const user = new User({ name, email, currentSkills: skillNames, targetRole, resumeText });
    await user.save();

    // Get target job role
    const jobRole = await JobRole.findOne({ title: targetRole });
    if (!jobRole) {
      return res.status(404).json({ error: 'Job role not found' });
    }

    // Identify missing skills
    const missingSkills = jobRole.requiredSkills.filter(
      skill => !skillNames.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    // Calculate match score
    const matchScore = Math.round(((jobRole.requiredSkills.length - missingSkills.length) / jobRole.requiredSkills.length) * 100);
    
    // Determine gap level
    let gapLevel = 'High';
    if (matchScore >= 80) gapLevel = 'Low';
    else if (matchScore >= 60) gapLevel = 'Moderate';
    
    // Determine career level based on skills and match score
    const avgSkillLevel = skillLevels.reduce((sum, s) => sum + s.level, 0) / skillLevels.length;
    let careerLevel = 'Beginner';
    if (matchScore >= 70 && avgSkillLevel >= 4) careerLevel = 'Advanced';
    else if (matchScore >= 50 && avgSkillLevel >= 3) careerLevel = 'Intermediate';
    
    // AI Confidence Score
    const aiConfidence = Math.min(95, Math.round(60 + (matchScore * 0.3) + (skillLevels.length * 2)));
    
    // Generate radar chart data
    const radarCategories = ['Programming', 'Frameworks', 'Tools', 'Databases', 'Soft Skills'];
    const radarData = radarCategories.map(cat => ({
      skill: cat,
      value: Math.floor(Math.random() * 40) + 60
    }));
    
    // Industry benchmark comparison
    const industryComparison = [
      { skill: 'Programming', yourScore: Math.min(100, matchScore + 10), industryAvg: 75 },
      { skill: 'Frameworks', yourScore: Math.min(100, matchScore - 5), industryAvg: 70 },
      { skill: 'Tools', yourScore: Math.min(100, matchScore + 5), industryAvg: 68 },
      { skill: 'Databases', yourScore: Math.min(100, matchScore), industryAvg: 72 }
    ];
    
    // Categorize missing skills
    const categorizedMissing = {
      critical: missingSkills.slice(0, Math.ceil(missingSkills.length / 3)),
      important: missingSkills.slice(Math.ceil(missingSkills.length / 3), Math.ceil(missingSkills.length * 2 / 3)),
      optional: missingSkills.slice(Math.ceil(missingSkills.length * 2 / 3))
    };
    
    // Get strengths
    const strengths = jobRole.requiredSkills.filter(skill => 
      skillNames.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
    );
    
    // Generate AI Summary
    const aiSummary = `Based on your ${skillNames.length} skills, you match ${matchScore}% of the ${targetRole} requirements. Your strongest area is ${strengths[0] || 'foundational skills'}, but you need to focus on ${categorizedMissing.critical[0] || 'core competencies'} to advance. With dedicated learning, you can bridge this gap in 3-4 months.`;

    // Generate AI roadmap (fallback without OpenAI)
    let roadmap;
    let recommendedCertifications = [];
    
    try {
      const prompt = `You are an AI career advisor. Analyze this profile and provide a structured learning roadmap.

Target Role: ${targetRole}
Current Skills: ${skillNames.join(', ')}
Missing Skills: ${missingSkills.join(', ')}
Skill Match: ${matchScore}%

Return ONLY valid JSON in this exact format:
{
  "roadmap": [
    {
      "month": "Month 1",
      "tasks": [
        {"title": "Learn X", "difficulty": "Easy", "estimatedTime": "2 weeks"},
        {"title": "Build Y", "difficulty": "Medium", "estimatedTime": "1 week"}
      ]
    }
  ],
  "recommendedCertifications": ["Cert 1", "Cert 2"]
}`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content);
      roadmap = aiResponse.roadmap || [];
      recommendedCertifications = aiResponse.recommendedCertifications || [];
    } catch (groqError) {
      console.log('Groq unavailable, using curated roadmap');
      
      // Curated roadmaps by role
      const roadmaps = {
        'Frontend Developer': {
          overview: "Master modern frontend development with React and responsive design. Build beautiful, interactive user interfaces.",
          phases: [
            {
              phase: "Phase 1: HTML & CSS Mastery",
              duration: "3-4 weeks",
              skills: ["HTML", "CSS", "Responsive Design"],
              resources: [
                "FreeCodeCamp Responsive Web Design",
                "CSS Tricks website",
                "Build 5 landing pages",
                "Learn Flexbox and Grid"
              ]
            },
            {
              phase: "Phase 2: JavaScript Fundamentals",
              duration: "4-6 weeks",
              skills: ["JavaScript", "ES6+", "DOM Manipulation"],
              resources: [
                "JavaScript.info tutorial",
                "Eloquent JavaScript book",
                "30 Days of JavaScript challenge",
                "Build interactive projects"
              ]
            },
            {
              phase: "Phase 3: React & TypeScript",
              duration: "6-8 weeks",
              skills: ["React", "TypeScript", "State Management"],
              resources: [
                "Official React documentation",
                "TypeScript handbook",
                "Build a full React app",
                "Learn React hooks deeply"
              ]
            }
          ],
          tips: [
            "Build projects, not just tutorials",
            "Focus on responsive design from day 1",
            "Learn browser DevTools thoroughly",
            "Create a portfolio website"
          ]
        },
        'Backend Developer': {
          overview: "Build scalable server-side applications with Node.js, Express, and MongoDB. Master API design and database management.",
          phases: [
            {
              phase: "Phase 1: Node.js Basics",
              duration: "3-4 weeks",
              skills: ["Node.js", "NPM", "Async Programming"],
              resources: [
                "Node.js official docs",
                "Learn async/await patterns",
                "Build CLI tools",
                "Understand event loop"
              ]
            },
            {
              phase: "Phase 2: Express & REST APIs",
              duration: "4-5 weeks",
              skills: ["Express", "REST API", "Middleware"],
              resources: [
                "Express.js documentation",
                "Build CRUD APIs",
                "Learn API best practices",
                "Postman for testing"
              ]
            },
            {
              phase: "Phase 3: Database & Auth",
              duration: "5-6 weeks",
              skills: ["MongoDB", "Database Design", "Authentication"],
              resources: [
                "MongoDB University",
                "Learn JWT authentication",
                "Database modeling patterns",
                "Build full backend project"
              ]
            }
          ],
          tips: [
            "Write clean, maintainable code",
            "Learn error handling properly",
            "Use environment variables",
            "Practice database optimization"
          ]
        },
        'Full Stack Developer': {
          overview: "Become a complete web developer by mastering both frontend and backend technologies. Build end-to-end applications.",
          phases: [
            {
              phase: "Phase 1: Frontend Foundation",
              duration: "6-8 weeks",
              skills: ["HTML", "CSS", "JavaScript", "React"],
              resources: [
                "FreeCodeCamp full curriculum",
                "Build responsive websites",
                "Learn React fundamentals",
                "Create interactive UIs"
              ]
            },
            {
              phase: "Phase 2: Backend Development",
              duration: "6-8 weeks",
              skills: ["Node.js", "Express", "MongoDB", "REST API"],
              resources: [
                "Node.js complete guide",
                "Build RESTful APIs",
                "Database design patterns",
                "Authentication systems"
              ]
            },
            {
              phase: "Phase 3: Full Stack Integration",
              duration: "4-6 weeks",
              skills: ["API Integration", "Deployment", "Git"],
              resources: [
                "Connect frontend to backend",
                "Deploy on Heroku/Vercel",
                "Learn Git workflows",
                "Build 2-3 full stack projects"
              ]
            }
          ],
          tips: [
            "Build complete projects end-to-end",
            "Learn deployment early",
            "Master Git and GitHub",
            "Create a strong portfolio"
          ]
        },
        'DevOps Engineer': {
          overview: "Master infrastructure, automation, and deployment pipelines. Learn containerization and cloud technologies.",
          phases: [
            {
              phase: "Phase 1: Linux & Git",
              duration: "3-4 weeks",
              skills: ["Linux", "Git", "Shell Scripting"],
              resources: [
                "Linux command line basics",
                "Git branching strategies",
                "Bash scripting tutorial",
                "Practice on Ubuntu VM"
              ]
            },
            {
              phase: "Phase 2: Docker & Containers",
              duration: "4-5 weeks",
              skills: ["Docker", "Kubernetes", "Container Orchestration"],
              resources: [
                "Docker official tutorial",
                "Kubernetes basics",
                "Containerize applications",
                "Learn Docker Compose"
              ]
            },
            {
              phase: "Phase 3: CI/CD & Cloud",
              duration: "5-6 weeks",
              skills: ["CI/CD", "AWS", "Infrastructure as Code"],
              resources: [
                "GitHub Actions tutorial",
                "AWS free tier practice",
                "Learn Terraform basics",
                "Build deployment pipelines"
              ]
            }
          ],
          tips: [
            "Practice on real projects",
            "Automate everything",
            "Learn cloud platforms",
            "Get AWS certifications"
          ]
        },
        'Cybersecurity Specialist': {
          overview: "Master cybersecurity fundamentals, ethical hacking, and security operations. Protect systems from cyber threats.",
          phases: [
            {
              phase: "Phase 1: Security Fundamentals",
              duration: "4-5 weeks",
              skills: ["Network Security", "Cryptography", "Security Protocols"],
              resources: [
                "CompTIA Security+ course",
                "Cybrary free courses",
                "Learn TCP/IP and OSI model",
                "Study encryption algorithms"
              ]
            },
            {
              phase: "Phase 2: Ethical Hacking",
              duration: "6-8 weeks",
              skills: ["Penetration Testing", "Ethical Hacking", "Vulnerability Assessment"],
              resources: [
                "TryHackMe platform",
                "HackTheBox challenges",
                "Kali Linux tutorials",
                "CEH certification prep"
              ]
            },
            {
              phase: "Phase 3: Security Operations",
              duration: "5-6 weeks",
              skills: ["SIEM Tools", "Incident Response", "Threat Intelligence"],
              resources: [
                "Splunk fundamentals",
                "SANS incident response guide",
                "Security monitoring labs",
                "Practice with real scenarios"
              ]
            }
          ],
          tips: [
            "Get certified (Security+, CEH, CISSP)",
            "Practice on CTF challenges",
            "Stay updated on latest threats",
            "Build a home security lab"
          ]
        }
      };
      
      // Fallback roadmap with new enhanced format
      const certsByRole = {
        'Frontend Developer': ['Meta Front-End Developer', 'AWS Certified Developer', 'Google UX Design'],
        'Backend Developer': ['AWS Certified Solutions Architect', 'MongoDB Certified Developer', 'Oracle Java Certification'],
        'Full Stack Developer': ['AWS Certified Developer', 'Meta Full-Stack Engineer', 'Microsoft Certified: Azure Developer'],
        'DevOps Engineer': ['AWS Certified DevOps Engineer', 'Kubernetes Administrator (CKA)', 'Docker Certified Associate'],
        'Cybersecurity Specialist': ['CompTIA Security+', 'CEH (Certified Ethical Hacker)', 'CISSP', 'OSCP']
      };
      
      roadmap = [
        { 
          month: 'Month 1', 
          tasks: [
            { title: `Learn ${missingSkills[0] || 'fundamentals'}`, difficulty: 'Easy', estimatedTime: '2 weeks' },
            { title: 'Complete online tutorials', difficulty: 'Easy', estimatedTime: '1 week' },
            { title: 'Build small practice projects', difficulty: 'Medium', estimatedTime: '1 week' }
          ]
        },
        { 
          month: 'Month 2', 
          tasks: [
            { title: `Master ${missingSkills[1] || 'core concepts'}`, difficulty: 'Medium', estimatedTime: '2 weeks' },
            { title: 'Work on real-world project', difficulty: 'Hard', estimatedTime: '2 weeks' }
          ]
        },
        { 
          month: 'Month 3', 
          tasks: [
            { title: 'Build portfolio project', difficulty: 'Hard', estimatedTime: '3 weeks' },
            { title: 'Prepare for certification', difficulty: 'Medium', estimatedTime: '1 week' }
          ]
        }
      ];
      
      recommendedCertifications = certsByRole[targetRole] || ['Industry Standard Certification', 'Professional Development Course'];
    }

    // Save learning path
    const learningPath = new LearningPath({
      userId: user._id,
      targetRole,
      missingSkills: categorizedMissing,
      roadmap: { roadmap, recommendedCertifications, matchScore, careerLevel, gapLevel, aiConfidence }
    });
    await learningPath.save();

    res.json({
      matchScore,
      gapLevel,
      strengths,
      aiSummary,
      industryComparison,
      missingSkills: categorizedMissing,
      roadmap,
      recommendedCertifications,
      careerLevel,
      radarData,
      aiConfidence,
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
    if (!learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    res.json(learningPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
