/**
 * Translates a question row from the question bank into the shape the exam UI
 * renders.
 *
 * The bank stores `q_type` using the values the admin's Test Initiation presets
 * speak (`single_correct`, `multi_correct`, `integer`), while the exam
 * components were written against the mock papers, which use `type` with the
 * values `mcq` / `msq` / `nat`. Nothing bridged the two, so a real test rendered
 * the question text with no options and no keypad underneath it — the student
 * could read the paper but had no way to answer it.
 *
 * The bank also has no `section` column. JEE splits objective questions
 * (Section A) from numerical ones (Section B), so the section is derived from
 * the question type rather than invented.
 */

// `assertion` is an MCQ in every way that matters here — four statements about
// an Assertion/Reason pair, one of which is right. The PDF pipeline emits it,
// so name it rather than leaving it to the options-based guess below.
const MCQ_TYPES = ['mcq', 'single_correct', 'single', 'scq', 'assertion'];
const MSQ_TYPES = ['msq', 'multi_correct', 'multiple_correct', 'multi', 'multiple'];
const NAT_TYPES = ['nat', 'integer', 'numerical', 'numeric', 'int'];

/** `q_type` (or `type`) -> the three shapes QuestionPanel knows how to render. */
export function normaliseQuestionType(raw, question = {}) {
  const key = String(raw || '').trim().toLowerCase();

  if (MCQ_TYPES.includes(key)) return 'mcq';
  if (MSQ_TYPES.includes(key)) return 'msq';
  if (NAT_TYPES.includes(key)) return 'nat';

  // Unknown or missing type: infer from the payload. A question with options is
  // answered by picking one; a question without any can only be typed in.
  return Array.isArray(question.options) && question.options.length > 0 ? 'mcq' : 'nat';
}

/** Exam sections based on question type. */
export function sectionForType(type) {
  if (type === 'mcq') return 'MCQ';
  if (type === 'msq') return 'MSQ';
  if (type === 'nat') return 'Numerical';
  return 'Objective';
}

/**
 * Maps one `test_questions` row from `GET /tests/:id/questions` into a question
 * the exam components can render.
 */
export function normaliseQuestion(row) {
  const question = row?.questions || row || {};
  const type = normaliseQuestionType(question.q_type ?? question.type, question);

  return {
    ...question,
    type,
    section: question.section || sectionForType(type),
    subject: question.subject || 'General',
    marks: row?.marks_override ?? question.marks ?? 4,
  };
}

/** The whole paper, grouped naturally by subject and section (MCQ -> MSQ -> Numerical). */
export function normalisePaper(rows) {
  const list = (rows || []).map(normaliseQuestion);
  const sectionPriority = { MCQ: 1, MSQ: 2, Numerical: 3, Objective: 4 };

  const subjectOrder = new Map();
  let nextSubj = 0;
  for (const q of list) {
    if (!subjectOrder.has(q.subject)) {
      subjectOrder.set(q.subject, nextSubj++);
    }
  }

  return list.sort((a, b) => {
    const sDiff = (subjectOrder.get(a.subject) ?? 0) - (subjectOrder.get(b.subject) ?? 0);
    if (sDiff !== 0) return sDiff;
    const secDiff = (sectionPriority[a.section] ?? 99) - (sectionPriority[b.section] ?? 99);
    return secDiff;
  });
}

/** Distinct subjects in paper order — the exam's subject tabs are built from this. */
export function subjectsInPaper(questions) {
  return [...new Set((questions || []).map((q) => q.subject).filter(Boolean))];
}

/** Distinct sections within one subject, in MCQ -> MSQ -> Numerical order. */
export function sectionsInSubject(questions, subject) {
  const sectionPriority = { MCQ: 1, MSQ: 2, Numerical: 3, Objective: 4 };
  const sections = [
    ...new Set(
      (questions || []).filter((q) => q.subject === subject).map((q) => q.section).filter(Boolean),
    ),
  ];
  return sections.sort((a, b) => (sectionPriority[a] ?? 99) - (sectionPriority[b] ?? 99));
}
