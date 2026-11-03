const { createClient } = require('./backend/node_modules/@supabase/supabase-js');
const fs = require('fs');

const envText = fs.readFileSync('backend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) env[match[1]] = match[2].trim();
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const letterMap = { A: 0, B: 1, C: 2, D: 3 };

function getTopic(idx, q) {
  // idx is 1-based (1 to 100)
  if (idx >= 1 && idx <= 73) return 'Chemical Bonding';
  if (idx >= 74 && idx <= 91) return 'Coordination Compounds';
  if (idx >= 92 && idx <= 100) return 'Metallurgy';
  return 'General';
}

async function main() {
  const rawData = JSON.parse(fs.readFileSync('inorganic_questions.json', 'utf8'));
  console.log(`Loaded ${rawData.length} questions from inorganic_questions.json.`);

  // Get chemistry teacher ID
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', 'chemistry_teacher@edu.com')
    .single();

  const createdBy = users?.id || 'b8f9e342-ae65-4ca2-8494-99b8c7e0bb04';
  console.log(`Using created_by: ${createdBy} (${users?.email || 'default chemistry teacher'})`);

  const rows = rawData.map((item, i) => {
    const idx = i + 1;
    const topic = getTopic(idx, item);
    const ansLetter = (item.answer || 'A').toUpperCase().trim();
    const ansIndex = letterMap[ansLetter] ?? 0;

    const options = [
      String(item.options?.A ?? ''),
      String(item.options?.B ?? ''),
      String(item.options?.C ?? ''),
      String(item.options?.D ?? ''),
    ];

    return {
      subject: 'Chemistry',
      topic,
      subtopic: null,
      difficulty: 'medium',
      q_type: 'single_correct',
      question_text: item.question.trim(),
      image_url: null,
      options,
      correct_answer: {
        index: ansIndex,
        letter: ansLetter,
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
    .eq('subject', 'Chemistry');

  if (existError) {
    console.error('Error fetching existing questions:', existError);
    return;
  }

  const existingTexts = new Set((existing || []).map(q => q.question_text.trim()));
  const newRows = rows.filter(r => !existingTexts.has(r.question_text));

  console.log(`Found ${existingTexts.size} existing Chemistry questions.`);
  console.log(`${newRows.length} questions are new and will be inserted.`);

  if (newRows.length === 0) {
    console.log('All questions are already in the database.');
    return;
  }

  // Insert in batches of 25
  const BATCH_SIZE = 25;
  let insertedTotal = 0;
  for (let i = 0; i < newRows.length; i += BATCH_SIZE) {
    const batch = newRows.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase.from('questions').insert(batch).select('id');
    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
      throw error;
    }
    insertedTotal += data.length;
    console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${data.length} questions, total: ${insertedTotal}).`);
  }

  console.log(`\nSuccessfully added ${insertedTotal} Chemistry questions to the database!`);

  // Verify counts by topic
  const { data: summary, error: sumError } = await supabase
    .from('questions')
    .select('topic')
    .eq('subject', 'Chemistry');

  if (!sumError && summary) {
    const counts = {};
    summary.forEach(s => {
      counts[s.topic] = (counts[s.topic] || 0) + 1;
    });
    console.log('\nCurrent Chemistry questions in database by topic:');
    console.table(counts);
  }
}

main().catch(err => {
  console.error('Migration script failed:', err);
  process.exit(1);
});
