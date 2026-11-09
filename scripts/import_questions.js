const path = require('path');
const fs = require('fs');

const { createClient } = require('../backend/node_modules/@supabase/supabase-js');
require('../backend/node_modules/dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const p1Path = 'C:/Users/vaibh/.gemini/antigravity/brain/13e388b4-01b1-41aa-9237-c79823aac173/.user_uploaded/media_1794065009400_29fcfb84.json';
const p2Path = 'C:/Users/vaibh/.gemini/antigravity/brain/13e388b4-01b1-41aa-9237-c79823aac173/.user_uploaded/media_1794065009400_d7c0c3bb.json';

const PHYSICS_TEACHER_ID = '3c3d6285-d44a-44df-a8d0-eff16d1efba9';
const MATHS_TEACHER_ID = 'e7ed86ac-6ef2-4efe-9fea-fe0554140044';

function extractRealInteger(val) {
  if (val === null || val === undefined) return null;
  const raw = String(typeof val === 'object' ? (val.value ?? '') : val).trim();
  if (!raw) return null;
  if (/^-?\d+$/.test(raw)) return raw;
  const cleaned = raw
    .replace(/\\text\{[^}]*\}/g, '')
    .replace(/\\mathrm\{[^}]*\}/g, '')
    .replace(/[\$\s]/g, '')
    .replace(/(km\/h|m\/s|cm\/s|m\/s\^2|cm|mm|km|m|s|min|h|kg|g|N|J|W|V|A|C|T|Hz|rad\/s|rad|deg|degrees|°)/gi, '');
  if (/^-?\d+$/.test(cleaned)) return cleaned;
  if (/^-?\d+\.0+$/.test(cleaned)) return String(parseInt(cleaned, 10));
  return null;
}

function mapQuestion(q, defaultCreatorId) {
  let q_type = 'single_correct';
  const rawType = String(q.type || '').trim().toLowerCase();

  if (rawType === 'single correct' || rawType === 'single_correct') {
    q_type = 'single_correct';
  } else if (rawType === 'multiple correct' || rawType === 'multi_correct' || rawType === 'multiple_correct') {
    q_type = 'multi_correct';
  } else if (rawType === 'numerical') {
    // In numerical question section, strictly keep real integer answers; formulas/proofs are subjective
    const realInt = extractRealInteger(q.answer);
    q_type = realInt !== null ? 'numerical' : 'subjective';
  } else if (rawType === 'subjective') {
    q_type = 'subjective';
  } else {
    throw new Error(`Unknown type ${q.type} for question ID ${q.id}`);
  }

  let options = [];
  let correct_answer = {};

  if (q_type === 'single_correct') {
    options = [q.options.A, q.options.B, q.options.C, q.options.D];
    const letter = String(q.answer).trim().toUpperCase();
    const map = { A: 0, B: 1, C: 2, D: 3 };
    if (map[letter] === undefined) {
      throw new Error(`Invalid single correct answer: ${q.answer} in question ${q.id}`);
    }
    correct_answer = { index: map[letter] };
  } else if (q_type === 'multi_correct') {
    options = [q.options.A, q.options.B, q.options.C, q.options.D];
    const letters = String(q.answer)
      .split(/[\s,]+/)
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);
    const map = { A: 0, B: 1, C: 2, D: 3 };
    const indices = letters
      .map(l => map[l])
      .filter(idx => idx !== undefined)
      .sort((a, b) => a - b);
    const uniqueIndices = Array.from(new Set(indices));
    if (uniqueIndices.length === 0) {
      throw new Error(`Empty multi correct indices: ${q.answer} in question ${q.id}`);
    }
    correct_answer = { indices: uniqueIndices };
  } else if (q_type === 'numerical') {
    options = [];
    correct_answer = { value: extractRealInteger(q.answer) };
  } else {
    // subjective
    options = [];
    correct_answer = { value: String(q.answer).trim() };
  }

  return {
    subject: String(q.subject).trim(),
    topic: String(q.topic).trim(),
    subtopic: null,
    question_text: String(q.question).trim(),
    options,
    correct_answer,
    difficulty: 'medium',
    q_type,
    marks: 4,
    created_by: defaultCreatorId,
    is_active: true,
    review_status: 'approved',
    source: 'manual',
  };
}

async function run() {
  console.log('Loading input files...');
  const p1 = JSON.parse(fs.readFileSync(p1Path, 'utf8'));
  const p2 = JSON.parse(fs.readFileSync(p2Path, 'utf8'));

  console.log(`Loaded ${p1.length} Physics questions and ${p2.length} Maths questions.`);

  const mappedPhysics = p1.map(q => mapQuestion(q, PHYSICS_TEACHER_ID));
  const mappedMaths = p2.map(q => mapQuestion(q, MATHS_TEACHER_ID));

  const allRecords = [...mappedPhysics, ...mappedMaths];
  console.log(`Total records to insert: ${allRecords.length}`);

  const BATCH_SIZE = 100;
  let totalInserted = 0;

  for (let i = 0; i < allRecords.length; i += BATCH_SIZE) {
    const batch = allRecords.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase.from('questions').insert(batch).select('id');
    if (error) {
      console.error('Error inserting batch at offset', i, ':', error.message);
      process.exit(1);
    }
    totalInserted += (data ? data.length : 0);
    process.stdout.write(`Inserted ${totalInserted}/${allRecords.length} questions...\r`);
  }

  console.log(`\nSuccessfully inserted all ${totalInserted} questions!`);

  // Verification counts
  const { count: physCount } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'Physics');
  const { count: mathCount } = await supabase.from('questions').select('*', { count: 'exact', head: true }).eq('subject', 'Mathematics');
  const { count: totalCount } = await supabase.from('questions').select('*', { count: 'exact', head: true });

  console.log('\n--- Database Verification Counts ---');
  console.log(`Physics questions in DB: ${physCount}`);
  console.log(`Mathematics questions in DB: ${mathCount}`);
  console.log(`Total questions in DB: ${totalCount}`);
}

run().catch(err => {
  console.error('Fatal error during import:', err);
  process.exit(1);
});
