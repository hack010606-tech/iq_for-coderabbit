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

function formatMathText(text) {
  if (!text) return text;
  let t = text;

  // Clean citation tags
  t = t.replace(/\s*\[cite:\s*[\d,\s]+\]/g, '');

  // Wrap equations with ^ or common math if not already wrapped
  if (!t.includes('$')) {
    // Wrap expressions like x^2 + xy = 12
    t = t.replace(/(x\^2\s*\+\s*xy\s*=\s*12)/g, '$$$1$$');
    t = t.replace(/(2xy\s*\+\s*3y\^2\s*\+\s*5\s*=\s*0)/g, '$$$1$$');
    t = t.replace(/(x\s*\+\s*4y)/g, '$$$1$$');
    t = t.replace(/(x\^3\s*-\s*2x\s*\+\s*c)/g, '$$$1$$');
    t = t.replace(/(a\^2\(2a\^2\s*\+\s*4ab\s*\+\s*3b\^2\)\s*=\s*3)/g, '$$$1$$');
    t = t.replace(/(b\^2\(3a\^2\s*\+\s*4ab\s*\+\s*2b\^2\))/g, '$$$1$$');
    t = t.replace(/(x\^2\s*-\s*x\(k\s*-\s*2\)\s*\+\s*\(k\^2\s*\+\s*3k\s*\+\s*5\)\s*=\s*0)/g, '$$$1$$');
    t = t.replace(/(\b\w\^[0-9]+)/g, '$$$1$$');
    // Wrap Greek letters
    t = t.replace(/(?<!\$)(α|β|θ|π|λ|μ)(?!\$)/g, '$$$1$$');
    // Wrap +/- 
    t = t.replace(/(±)/g, '$$$1$$');
    // Clean double dollars $$
    t = t.replace(/\$\$(\w+)\$\$/g, '$$$1$$');
  }

  return t;
}

async function updateMathQuestions() {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, question_text, options')
    .eq('subject', 'Mathematics')
    .eq('q_type', 'single_correct');

  if (error) {
    console.error('Error fetching questions:', error);
    return;
  }

  console.log(`Found ${questions.length} single_correct Mathematics questions.`);

  let updated = 0;
  for (const q of questions) {
    let newText = q.question_text;
    
    // Check if question has raw math like ^, alpha, beta, etc. without $
    if (!newText.includes('$') && (newText.includes('^') || newText.includes('α') || newText.includes('β') || newText.includes('θ') || newText.includes('sin') || newText.includes('cos') || newText.includes('tan') || newText.includes('√'))) {
      // Auto-wrap math symbols and simple formulas
      newText = newText
        .replace(/(\b[a-zA-Z0-9_\(\)]+\^[a-zA-Z0-9_\(\)\+\-]+)/g, '$$$1$$')
        .replace(/(\b\d+\s*<=\s*\w+\s*<=\s*\d+\b)/g, '$$$1$$')
        .replace(/(α|β|θ|π|λ|μ|Δ)/g, '$$$1$$')
        .replace(/(√\d+)/g, '$$$1$$')
        .replace(/(\$\s*\$)/g, '')
        .replace(/\$\s*\$/g, ' ')
        .replace(/\${2,}/g, '$');

      const { error: updErr } = await supabase
        .from('questions')
        .update({ question_text: newText })
        .eq('id', q.id);

      if (!updErr) updated++;
    }
  }

  console.log(`Updated ${updated} single_correct Mathematics questions with math formatting.`);
}

updateMathQuestions();
