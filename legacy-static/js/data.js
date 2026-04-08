/* ================================================
   js/data.js — Static Data: Questions, Streams, Companies
   ================================================ */

const STREAMS = [
  { id: 'se',     name: 'Software Engineering', icon: '💻', color: '#6c63ff', desc: 'Data structures, algorithms, OOP, system design' },
  { id: 'ds',     name: 'Data Science',          icon: '📊', color: '#4fd1c5', desc: 'ML, statistics, Python, data analysis' },
  { id: 'pm',     name: 'Product Management',    icon: '🎯', color: '#f6ad55', desc: 'Roadmaps, stakeholders, metrics, strategy' },
  { id: 'mkt',    name: 'Marketing',             icon: '📣', color: '#fc8181', desc: 'Campaign strategy, analytics, branding' },
  { id: 'fin',    name: 'Finance',               icon: '💰', color: '#68d391', desc: 'Financial analysis, valuation, markets' },
  { id: 'hr',     name: 'Human Resources',       icon: '👥', color: '#b794f4', desc: 'Talent, culture, HRBP, compliance' },
  { id: 'ops',    name: 'Operations',            icon: '⚙️', color: '#76e4f7', desc: 'Process, supply chain, logistics' },
  { id: 'sales',  name: 'Sales',                 icon: '🤝', color: '#fbd38d', desc: 'Pipeline, objections, CRM, closing' },
  { id: 'design', name: 'UI/UX Design',          icon: '🎨', color: '#f687b3', desc: 'Research, wireframes, user testing' },
];

const COMPANIES = [
  { id: 'google',    name: 'Google',    icon: '🔍', color: '#4285F4', industry: 'Tech',         required: 85 },
  { id: 'amazon',    name: 'Amazon',    icon: '📦', color: '#FF9900', industry: 'E-Commerce',   required: 80 },
  { id: 'microsoft', name: 'Microsoft', icon: '🪟', color: '#00A4EF', industry: 'Tech',         required: 82 },
  { id: 'meta',      name: 'Meta',      icon: '🌐', color: '#1877F2', industry: 'Social Media', required: 83 },
  { id: 'apple',     name: 'Apple',     icon: '🍎', color: '#888888', industry: 'Tech',         required: 88 },
  { id: 'infosys',   name: 'Infosys',   icon: '🏛️', color: '#007CC3', industry: 'IT Services',  required: 65 },
  { id: 'tcs',       name: 'TCS',       icon: '🔷', color: '#0052CC', industry: 'IT Services',  required: 60 },
  { id: 'wipro',     name: 'Wipro',     icon: '🌊', color: '#341c75', industry: 'IT Services',  required: 62 },
  { id: 'deloitte',  name: 'Deloitte',  icon: '🏢', color: '#86BC25', industry: 'Consulting',   required: 75 },
];

/* 60+ real interview questions */
const ALL_QUESTIONS = [
  // ---- SOFTWARE ENGINEERING ----
  { id:1,  stream:'se', company:'google',    text:'Explain the difference between a stack and a queue. Give a real-world example of each.', diff:'Easy',   type:'Technical'  },
  { id:2,  stream:'se', company:'google',    text:'What is Big O notation? Explain O(n log n) with an example algorithm.',                  diff:'Medium', type:'Technical'  },
  { id:3,  stream:'se', company:'amazon',    text:'Design a URL shortening service like bit.ly. Walk through the full system design.',       diff:'Hard',   type:'Technical'  },
  { id:4,  stream:'se', company:'microsoft', text:'What is the difference between a process and a thread?',                                  diff:'Medium', type:'Technical'  },
  { id:5,  stream:'se', company:'meta',      text:'Explain how garbage collection works in Java or Python.',                                  diff:'Medium', type:'Technical'  },
  { id:6,  stream:'se', company:'google',    text:'What are SOLID principles? Give an example of the Single Responsibility Principle.',      diff:'Medium', type:'Technical'  },
  { id:7,  stream:'se', company:'apple',     text:'How would you reverse a linked list both iteratively and recursively?',                   diff:'Medium', type:'Technical'  },
  { id:8,  stream:'se', company:'amazon',    text:'Tell me about a time you had to debug a critical production issue. How did you approach it?', diff:'Medium', type:'Behavioral'},
  { id:9,  stream:'se', company:'tcs',       text:'What is the difference between SQL and NoSQL databases? When would you use each?',        diff:'Easy',   type:'Technical'  },
  { id:10, stream:'se', company:'infosys',   text:'Explain RESTful APIs and HTTP methods GET, POST, PUT, DELETE.',                           diff:'Easy',   type:'Technical'  },
  { id:11, stream:'se', company:'google',    text:'What is a deadlock? How can you prevent and resolve it?',                                 diff:'Hard',   type:'Technical'  },
  { id:12, stream:'se', company:'microsoft', text:'Describe the MVC architectural pattern and its advantages.',                              diff:'Medium', type:'Technical'  },
  { id:13, stream:'se', company:'amazon',    text:'What is the CAP theorem and how does it apply to distributed systems?',                   diff:'Hard',   type:'Technical'  },

  // ---- DATA SCIENCE ----
  { id:14, stream:'ds', company:'google',    text:'Explain the bias-variance tradeoff in machine learning models.',                          diff:'Medium', type:'Technical'  },
  { id:15, stream:'ds', company:'amazon',    text:'What is the difference between supervised and unsupervised learning? Give examples.',     diff:'Easy',   type:'Technical'  },
  { id:16, stream:'ds', company:'meta',      text:'How would you handle imbalanced datasets in a classification problem?',                   diff:'Hard',   type:'Technical'  },
  { id:17, stream:'ds', company:'google',    text:'Explain how Random Forest works and how it reduces overfitting.',                         diff:'Medium', type:'Technical'  },
  { id:18, stream:'ds', company:'microsoft', text:'What is cross-validation and why is it important?',                                       diff:'Medium', type:'Technical'  },
  { id:19, stream:'ds', company:'infosys',   text:'Describe the steps in a typical data science project pipeline.',                          diff:'Easy',   type:'Technical'  },
  { id:20, stream:'ds', company:'amazon',    text:'What is regularization? Explain L1 vs L2 regularization.',                               diff:'Hard',   type:'Technical'  },
  { id:21, stream:'ds', company:'google',    text:'How would you approach a recommendation system project from scratch?',                    diff:'Hard',   type:'Technical'  },
  { id:22, stream:'ds', company:'meta',      text:'Explain A/B testing and how you would design one for a new feature.',                    diff:'Medium', type:'Technical'  },
  { id:23, stream:'ds', company:'tcs',       text:'What is the Central Limit Theorem and why is it important?',                             diff:'Medium', type:'Technical'  },

  // ---- PRODUCT MANAGEMENT ----
  { id:24, stream:'pm', company:'google',    text:'How would you prioritize features in a product backlog?',                                 diff:'Medium', type:'Technical'  },
  { id:25, stream:'pm', company:'amazon',    text:'What metrics would you track to measure the success of a new product launch?',            diff:'Medium', type:'Technical'  },
  { id:26, stream:'pm', company:'meta',      text:'Walk me through how you would handle engineers pushing back on your timeline.',           diff:'Hard',   type:'Behavioral' },
  { id:27, stream:'pm', company:'google',    text:'Describe a product you love. What would you improve about it?',                          diff:'Easy',   type:'Behavioral' },
  { id:28, stream:'pm', company:'microsoft', text:'How do you gather user requirements and translate them into product features?',            diff:'Medium', type:'Technical'  },
  { id:29, stream:'pm', company:'amazon',    text:'Tell me about a time you made a data-driven product decision.',                          diff:'Medium', type:'Behavioral' },
  { id:30, stream:'pm', company:'apple',     text:'Design a product for elderly users to stay connected with family.',                       diff:'Hard',   type:'Technical'  },
  { id:31, stream:'pm', company:'deloitte',  text:'What is a product roadmap and how would you present it to stakeholders?',                diff:'Easy',   type:'Technical'  },
  { id:32, stream:'pm', company:'google',    text:'How would you decide to sunset an underperforming feature?',                             diff:'Hard',   type:'Technical'  },
  { id:33, stream:'pm', company:'meta',      text:'What is the North Star metric and how do you identify it for a product?',                diff:'Medium', type:'Technical'  },

  // ---- HR / BEHAVIORAL ----
  { id:34, stream:'hr', company:'tcs',       text:'Tell me about yourself and why you are interested in this role.',                        diff:'Easy',   type:'HR'         },
  { id:35, stream:'hr', company:'infosys',   text:'Where do you see yourself in 5 years?',                                                  diff:'Easy',   type:'HR'         },
  { id:36, stream:'hr', company:'wipro',     text:'Describe a time you had a conflict with a team member. How did you resolve it?',         diff:'Medium', type:'Behavioral' },
  { id:37, stream:'hr', company:'deloitte',  text:'What is your greatest weakness and how are you working on it?',                          diff:'Medium', type:'HR'         },
  { id:38, stream:'hr', company:'google',    text:'Tell me about a time you failed and what you learned from it.',                          diff:'Medium', type:'Behavioral' },
  { id:39, stream:'hr', company:'amazon',    text:'How do you handle tight deadlines and high-pressure situations?',                        diff:'Medium', type:'Behavioral' },
  { id:40, stream:'hr', company:'microsoft', text:'What motivates you professionally and how does this role align with your goals?',        diff:'Easy',   type:'HR'         },
  { id:41, stream:'hr', company:'meta',      text:'Describe a time you went above and beyond for a customer or stakeholder.',               diff:'Medium', type:'Behavioral' },

  // ---- FINANCE ----
  { id:42, stream:'fin', company:'deloitte', text:'Walk me through a DCF valuation model step by step.',                                    diff:'Hard',   type:'Technical'  },
  { id:43, stream:'fin', company:'deloitte', text:'What is the difference between EBITDA and net income?',                                  diff:'Medium', type:'Technical'  },
  { id:44, stream:'fin', company:'amazon',   text:'If the Fed raises interest rates by 1%, what happens to bond prices? Why?',              diff:'Medium', type:'Technical'  },
  { id:45, stream:'fin', company:'deloitte', text:'Explain the three financial statements and how they are interconnected.',                 diff:'Hard',   type:'Technical'  },
  { id:46, stream:'fin', company:'infosys',  text:'What is working capital and why does it matter for a business?',                         diff:'Medium', type:'Technical'  },
  { id:47, stream:'fin', company:'deloitte', text:'What is WACC and how is it used in valuation?',                                          diff:'Hard',   type:'Technical'  },

  // ---- UI/UX DESIGN ----
  { id:48, stream:'design', company:'google',    text:'Explain your design process from discovery to final delivery.',                      diff:'Medium', type:'Technical'  },
  { id:49, stream:'design', company:'apple',     text:'How do you conduct user research and what methods do you prefer?',                   diff:'Medium', type:'Technical'  },
  { id:50, stream:'design', company:'meta',      text:'Design an onboarding experience for a new mobile banking app.',                     diff:'Hard',   type:'Technical'  },
  { id:51, stream:'design', company:'microsoft', text:'How do you balance user needs with business requirements?',                         diff:'Medium', type:'Behavioral' },
  { id:52, stream:'design', company:'apple',     text:'Tell me about a design decision you made that was data-driven.',                    diff:'Hard',   type:'Behavioral' },

  // ---- SALES ----
  { id:53, stream:'sales', company:'amazon',   text:'Walk me through your approach to handling a difficult objection from a prospect.',    diff:'Medium', type:'Behavioral' },
  { id:54, stream:'sales', company:'deloitte', text:'How do you prospect for new clients? Describe your full strategy.',                   diff:'Medium', type:'Technical'  },
  { id:55, stream:'sales', company:'tcs',      text:'Describe the SPIN selling methodology and how you have applied it.',                  diff:'Hard',   type:'Technical'  },
  { id:56, stream:'sales', company:'wipro',    text:'How do you build and maintain long-term relationships with key accounts?',            diff:'Medium', type:'Behavioral' },

  // ---- OPERATIONS ----
  { id:57, stream:'ops', company:'amazon',  text:'What is Lean manufacturing and what are its key principles?',                           diff:'Medium', type:'Technical'  },
  { id:58, stream:'ops', company:'amazon',  text:'Describe a time you improved a process. What was the measurable impact?',              diff:'Medium', type:'Behavioral' },
  { id:59, stream:'ops', company:'tcs',     text:'Explain Six Sigma and the DMAIC methodology.',                                         diff:'Hard',   type:'Technical'  },

  // ---- MARKETING ----
  { id:60, stream:'mkt', company:'meta',    text:'How would you launch a product in a new market with a limited budget?',                diff:'Hard',   type:'Technical'  },
  { id:61, stream:'mkt', company:'google',  text:'Explain the difference between SEO and SEM. When do you use each?',                   diff:'Easy',   type:'Technical'  },
  { id:62, stream:'mkt', company:'amazon',  text:'What KPIs would you track for a digital marketing campaign?',                         diff:'Medium', type:'Technical'  },
  { id:63, stream:'mkt', company:'meta',    text:'How do you measure brand awareness and what tools do you use?',                       diff:'Medium', type:'Technical'  },
];

/* AI Feedback pool */
const AI_FEEDBACKS = [
  "Good answer! You demonstrated solid understanding. Adding a specific real-world example would strengthen your response further.",
  "Excellent! Your explanation was clear and well-structured. Consider mentioning edge cases to show deeper expertise.",
  "Decent attempt — the core idea is correct but the explanation could be more concise. Practice the STAR method for behavioral questions.",
  "Strong response! You covered the main points well. Adding quantitative impact (numbers/metrics) would make this outstanding.",
  "Good structure. Starting with a direct answer before elaborating would sound more confident and interview-ready.",
  "You touched the right topics. For technical questions, always discuss time and space complexity.",
  "Well done! Your answer shows practical experience. Linking it to business impact would elevate this to a top-tier response.",
  "Needs more depth. Study this topic further and practice explaining it simply, then build complexity.",
  "Very good answer with clear examples. Work on your conclusion to leave a strong lasting impression.",
  "Solid foundational answer. To stand out, add a personal anecdote or project experience that illustrates this concept.",
];

/* Vocabulary feedback pool */
const VOCAB_FEEDBACK = [
  { word: 'Utilize',      better: 'Use',              tip: 'Simpler vocabulary sounds more natural and confident.' },
  { word: 'Basically',    better: 'Fundamentally',    tip: 'Filler qualifiers reduce authority in your speech.' },
  { word: 'Like (filler)',better: 'Strategic pause',  tip: 'Overuse of "like" as a filler weakens communication.' },
  { word: 'Um / Uh',      better: 'Brief silence',    tip: 'A confident pause sounds stronger than filler sounds.' },
  { word: 'I think maybe',better: 'I believe',        tip: 'Express opinions with confidence, not hesitation.' },
  { word: 'To be honest', better: 'Remove entirely',  tip: 'Implies you are less than honest the rest of the time.' },
];

/* Video interview question pool */
const VIDEO_QUESTIONS = [
  'Tell me about yourself and your key professional strengths.',
  'Why are you interested in this particular position?',
  'Describe the most challenging project you have worked on.',
  'How do you handle pressure, stress, and tight deadlines?',
  'Where do you see yourself professionally in 5 years?',
  'Tell me about a time you demonstrated leadership.',
  'What is your greatest professional achievement so far?',
  'How do you approach learning new technologies or skills?',
  'Describe your ideal work environment and management style.',
  'What questions do you have for us about the role or company?',
];
