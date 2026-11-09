const { createClient } = require('./backend/node_modules/@supabase/supabase-js');
const fs = require('fs');

const envText = fs.readFileSync('backend/.env', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx > 0) {
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTestQuestions() {
  const { data: tq, error } = await supabase
    .from('test_questions')
    .select('question_id, questions(id, subject, topic, q_type, question_text)')
    .eq('test_id', '8e75c716-4d2a-41ba-8148-628093840564');

  if (error) {
    console.error(error);
    return;
  }

  console.log('Total questions in test t1:', tq.length);
  const bySubject = {};
  tq.forEach(item => {
    const q = item.questions;
    if (!q) return;
    bySubject[q.subject] = bySubject[q.subject] || {};
    bySubject[q.subject][q.q_type] = (bySubject[q.subject][q.q_type] || 0) + 1;
  });
  console.log('Breakdown by subject and q_type:', JSON.stringify(bySubject, null, 2));

  console.log('\nAll questions in test t1:');
  tq.forEach((item, idx) => {
    const q = item.questions;
    if (q) {
      console.log((idx + 1) + '. [' + q.subject + '] [' + q.q_type + '] ' + (q.question_text || '').slice(0, 50));
    }
  });
}

checkTestQuestions();
