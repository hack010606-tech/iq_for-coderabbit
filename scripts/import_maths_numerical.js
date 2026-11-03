const { createClient } = require('./backend/node_modules/@supabase/supabase-js');
const fs = require('fs');

const envText = fs.readFileSync('backend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) env[match[1]] = match[2].trim();
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function getTopic(idx) {
  // idx is 1-based (1 to 20)
  if (idx >= 1 && idx <= 5) return 'Quadratic Equations';
  if (idx >= 6 && idx <= 11) return 'Trigonometry';
  if (idx >= 12 && idx <= 13) return 'Sequence and Series';
  if (idx >= 14 && idx <= 16) return 'Complex Numbers';
  if (idx === 17) return 'Permutation and Combination';
  if (idx >= 18 && idx <= 19) return 'Binomial Theorem';
  if (idx === 20) return 'Straight Line';
  return 'General';
}

async function main() {
  const rawData = JSON.parse(fs.readFileSync('maths_numerical_questions.json', 'utf8'));
  console.log(`Loaded ${rawData.length} integer/numerical questions from maths_numerical_questions.json.`);

  // Get maths teacher ID
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', 'maths_teacher@edu.com')
    .single();

  const createdBy = users?.id || 'e7ed86ac-6ef2-4efe-9fea-fe0554140044';
  console.log(`Using created_by: ${createdBy} (${users?.email || 'default maths teacher'})`);

  const rows = rawData.map((item, i) => {
    const idx = i + 1;
    const topic = getTopic(idx);
    const ansValue = String(item.answer ?? '').trim();

    // Clean citation tags if any
    const cleanText = item.question.replace(/\s*\[cite:\s*[\d,\s]+\]/g, '').trim();

    return {
      subject: 'Mathematics',
      topic,
      subtopic: null,
      difficulty: 'medium',
      q_type: 'numerical',
      question_text: cleanText,
      image_url: null,
      options: [],
      correct_answer: {
        value: ansValue,
      },
      marks: 4,
      created_by: createdBy,
      is_active: true,
      review_status: 'approved',
      source: 'manual',
    };
  });

  // Check existing questions to prevent duplicate insertion
  console.log('Checking for existing duplicates...');
  const { data: existing, error: existError } = await supabase
    .from('questions')
    .select('question_text')
    .eq('subject', 'Mathematics');

  if (existError) {
    console.error('Error fetching existing questions:', existError);
    return;
  }

  const existingTexts = new Set((existing || []).map(q => q.question_text.trim()));
  const newRows = rows.filter(r => !existingTexts.has(r.question_text));

  console.log(`Found ${existingTexts.size} existing Mathematics questions.`);
  console.log(`${newRows.length} questions are new and will be inserted.`);

  if (newRows.length === 0) {
    console.log('All questions are already in the database.');
    return;
  }

  const { data, error } = await supabase.from('questions').insert(newRows).select('id');
  if (error) {
    console.error('Error inserting questions:', error);
    throw error;
  }

  console.log(`\nSuccessfully added ${data.length} numerical Mathematics questions to the database!`);

  // Verify counts by topic
  const { data: summary, error: sumError } = await supabase
    .from('questions')
    .select('topic, q_type')
    .eq('subject', 'Mathematics');

  if (!sumError && summary) {
    const counts = {};
    summary.forEach(s => {
      counts[s.topic] = (counts[s.topic] || 0) + 1;
    });
    console.log('\nCurrent Mathematics questions in database by topic:');
    console.table(counts);

    const typeCounts = {};
    summary.forEach(s => {
      typeCounts[s.q_type] = (typeCounts[s.q_type] || 0) + 1;
    });
    console.log('\nCurrent Mathematics questions in database by question type:');
    console.table(typeCounts);
  }
}

main().catch(err => {
  console.error('Migration script failed:', err);
  process.exit(1);
});
