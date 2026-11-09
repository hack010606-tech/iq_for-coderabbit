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

const formatted = [
  {
    find: "The value of 'a' so that the equation x^3 - 6x^2",
    replace: "The value of 'a' so that the equation $x^3 - 6x^2 + 11x + a - 6 = 0$ has exactly three integer solutions is"
  },
  {
    find: "Remainder when P(x^5) is divided by P(x)",
    replace: "Remainder when $P(x^5)$ is divided by $P(x) = x^4 + x^3 + x^2 + x + 1$ is"
  },
  {
    find: "If a, b, c in I, a > 10 and (x - a)(x - 12)",
    replace: "If $a, b, c \\in \\mathbb{I}$, $a > 10$ and $(x - a)(x - 12) + 2 = (x + b)(x + c)$ for all $x \\in \\mathbb{R}$, then $|b - c| =$"
  },
  {
    find: "For real a, b, c, a + b + c = 2",
    replace: "For real $a, b, c$, $a + b + c = 2$, $a^2 + b^2 + c^2 = 6$ and $a^3 + b^3 + c^3 = 8$, then $(1 - a)(1 - b)(1 - c) =$"
  },
  {
    find: "Let f(x) = x^2 + bx + c, b, c in R",
    replace: "Let $f(x) = x^2 + bx + c$, $b, c \\in \\mathbb{R}$. If $f(x)$ is a factor of both $x^4 + 6x^2 + 25$ and $3x^4 + 4x^2 + 28x + 5$, then the minimum value of $f(x)$ is"
  },
  {
    find: "Let incircle of radius 4 units of a triangle ABC",
    replace: "Let incircle of radius 4 units of a triangle $ABC$ touch the side $BC$ at $D$. If $BD = 6$, $DC = 8$ and $\\Delta$ be the area of triangle, then $\\sqrt{\\sqrt{\\Delta - 3}} =$"
  },
  {
    find: "The total number of solutions of \\tan\\{x\\} = \\cot\\{x\\}",
    replace: "The total number of solutions of $\\tan\\{x\\} = \\cot\\{x\\}$; where $\\{x\\}$ denotes the fractional part of $x$ in $[0, 2\\pi]$ is"
  },
  {
    find: "If \\sin x + \\sin^2 x + \\sin^3 x = 1",
    replace: "If $\\sin x + \\sin^2 x + \\sin^3 x = 1$, then $\\cos^6 x - 4 \\cos^4 x + 8 \\cos^2 x =$"
  },
  {
    find: "The number of solutions of \\sin^{-1}",
    replace: "The number of solutions of $\\sin^{-1}\\left(\\frac{1+x^2}{2x}\\right) = \\frac{\\pi}{2} \\sec(x - 1)$ is"
  },
  {
    find: "If the square of the diameter of a circle circumscribing",
    replace: "If the square of the diameter of a circle circumscribing a $\\Delta ABC$ is equal to half the sum of the squares of its sides, then $\\sum \\sin^2 A =$"
  },
  {
    find: "If \\tan(142",
    replace: "If $\\tan\\left(142\\frac{1}{2}^{\\circ}\\right) = 2 + \\sqrt{2} - \\sqrt{\\mu} - \\sqrt{\\lambda}$, then $\\mu + \\lambda =$"
  },
  {
    find: "The value of expression [\\sqrt{1}]",
    replace: "The value of expression $[\\sqrt{1}] + [\\sqrt{2}] + [\\sqrt{3}] + \\dots + [\\sqrt{100^2}]$, (where $[.]$ denotes greatest integer function) is equal to"
  },
  {
    find: "Let a_i + b_i = 1",
    replace: "Let $a_i + b_i = 1\\ \\forall\\ i = 1, 2, \\dots, 6$ and $a = \\frac{1}{6}(a_1 + a_2 + \\dots + a_6)$, $b = \\frac{1}{6}(b_1 + b_2 + \\dots + b_6)$. Then $a_1b_1 + a_2b_2 + \\dots + a_6b_6 = nab - (a_1 - a)^2 - (a_2 - a)^2 - \\dots - (a_6 - a)^2$ where $n$ is equal to"
  },
  {
    find: "The number of solution(s) of the equation z^2 - z - |z|^2",
    replace: "The number of solution(s) of the equation $z^2 - z - |z|^2 - \\frac{64}{|z|^5} = 0$ is"
  },
  {
    find: "If \\arg(z) < 0",
    replace: "If $\\arg(z) < 0$, then $-\\frac{10}{\\pi} \\arg\\left(\\frac{z - \\bar{z}}{2}\\right)$ is equal to"
  },
  {
    find: "Let w, \\bar{w} is complex cube root of unity",
    replace: "Let $w, \\bar{w}$ be complex cube roots of unity and $P(z)$ is a point on a circle $|z| = 4$ such that $|z - 1|$ is maximum and centroid of triangle formed by $z, -w, -\\bar{w}$ is $\\alpha$, then $-7 \\text{Re}(\\alpha)$ is"
  },
  {
    find: "A staircase has 10 steps",
    replace: "A staircase has 10 steps. A person can go up the steps one at a time, two at a time, or any combination of $1$'s and $2$'s. If the number of ways in which the person can go up the stairs is $p$, then find $\\frac{p}{89}$"
  },
  {
    find: "The value of {}^{50}C_6",
    replace: "The value of ${}^{50}C_6 - {}^{5}C_1 {}^{40}C_6 + {}^{5}C_2 {}^{30}C_6 - {}^{5}C_3 {}^{20}C_6 + {}^{5}C_4 {}^{10}C_6$ is equal to"
  },
  {
    find: "The remainder obtained when 6^{2007}",
    replace: "The remainder obtained when $6^{2007} + 8^{2007}$ is divided by $49$ is equal to"
  },
  {
    find: "Let ABC be a triangle. Let A be the point (1, 2)",
    replace: "Let $ABC$ be a triangle. Let $A$ be the point $(1, 2)$, $y = x$ is the perpendicular bisector of $AB$ and $x - 2y + 1 = 0$ is the angle bisector of angle $C$. If the equation of $BC$ is given by $ax + by - 5 = 0$ then the value of $a + b$ is"
  }
];

async function updateAll() {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, question_text')
    .eq('subject', 'Mathematics')
    .eq('q_type', 'numerical');

  if (error) {
    console.error('Error fetching questions:', error);
    return;
  }

  let updated = 0;
  for (const q of questions) {
    for (const item of formatted) {
      if (q.question_text.includes(item.find)) {
        const { error: updErr } = await supabase
          .from('questions')
          .update({ question_text: item.replace })
          .eq('id', q.id);
        if (updErr) console.error('Error updating question:', updErr);
        else {
          updated++;
          console.log(`Updated question [${q.id}]: ${item.replace.slice(0, 60)}...`);
        }
        break;
      }
    }
  }
  console.log(`\nSuccessfully updated ${updated} questions with KaTeX LaTeX formatting!`);
}

updateAll();
