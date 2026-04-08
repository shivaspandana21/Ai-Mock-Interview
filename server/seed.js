const { getDb } = require('./db');
const fs = require('fs');
const path = require('path');

async function seed() {
  const db = await getDb();
  console.log('Seeding database...');

  // Ensure tables exist before inserting
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await db.exec(schemaSql);

  // Clear existing data
  await db.exec('DELETE FROM users');
  await db.exec('DELETE FROM interviews');
  await db.exec('DELETE FROM questions');
  await db.exec('DELETE FROM recordings');

  // Insert mock user
  const result = await db.run(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    ['Demo User', 'demo@interviewiq.ai', 'demo1234']
  );
  const userId = result.lastID;
  console.log(`Created user ${userId}`);

  // Insert Mock Questions
  const mockQuestions = [
    { text: 'Describe a time when you had to resolve a conflict within your team. How did you handle it, and what was the outcome?', category: 'Behavioral', difficulty: 'Medium', stream: 'Core' },
    { text: 'How do you prioritize multiple tasks with competing deadlines?', category: 'Situational', difficulty: 'Easy', stream: 'Core' },
    { text: 'Can you explain the difference between processes and threads?', category: 'Technical', difficulty: 'Medium', stream: 'SDE' },
    { text: 'What is the time complexity of the quicksort algorithm in the worst-case scenario, and how can you avoid it?', category: 'Technical', difficulty: 'Hard', stream: 'SDE' },
    { text: 'Explain the concept of Overfitting in Machine Learning.', category: 'Technical', difficulty: 'Medium', stream: 'AI/ML' },
    { text: 'Design a system like Twitter. What are the key components?', category: 'System Design', difficulty: 'Hard', stream: 'SDE' },
    { text: 'How do you handle scope creep from a stakeholder during an ongoing sprint?', category: 'Behavioral', difficulty: 'Medium', stream: 'Core' },
    { text: 'What are the SOLID principles of object-oriented design?', category: 'Technical', difficulty: 'Medium', stream: 'SDE' },
    { text: 'Explain React Hooks and give an example of a custom hook.', category: 'Technical', difficulty: 'Easy', stream: 'Frontend' }
  ];

  for (const q of mockQuestions) {
    await db.run(
      'INSERT INTO questions (text, category, difficulty, stream) VALUES (?, ?, ?, ?)',
      [q.text, q.category, q.difficulty, q.stream]
    );
  }
  console.log('Questions seeded.');

  // Insert Mock Interviews
  const mockInterviews = [
    { title: 'Google SDE Mock Interview', stream: 'SDE', score: 85, results: JSON.stringify({ strengths: ['DSA', 'Communication'], weaknesses: ['System Design'] }) },
    { title: 'Amazon AWS Behavioral', stream: 'Core', score: 92, results: JSON.stringify({ strengths: ['Leadership Principles', 'Conflict Resolution'], weaknesses: [] }) },
    { title: 'Data Science Quick Prep', stream: 'AI/ML', score: 70, results: JSON.stringify({ strengths: ['Stats'], weaknesses: ['Deep Learning', 'SQL'] }) }
  ];

  for (const i of mockInterviews) {
    await db.run(
      'INSERT INTO interviews (user_id, title, stream, score, results) VALUES (?, ?, ?, ?, ?)',
      [userId, i.title, i.stream, i.score, i.results]
    );
  }
  console.log('Interviews seeded.');

  console.log('Database seeding complete!');
}

seed().catch(err => console.error(err));
