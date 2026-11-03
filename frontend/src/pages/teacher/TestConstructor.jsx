import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Search, Plus, Trash2, FileText, Settings, ListChecks } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { apiClient } from '../../api/client';
import MathText from '../../components/MathText';
import './TestConstructor.css';

const MCQ_TYPES = ['mcq', 'single_correct', 'single', 'scq', 'multi_correct', 'multiple_correct', 'multi', 'multiple', 'assertion'];
const NAT_TYPES = ['nat', 'integer', 'numerical', 'numeric', 'int'];

// Chapter / topic list per subject — mirrors QuestionBank.jsx
const CHAPTERS = {
  Physics: [
    'DC Circuits and Capacitors', 'Dynamics of a Particle', 'Electrostatics',
    'EMI and AC Circuits', 'Energy and Momentum', 'Gaseous State and Thermodynamics',
    'Kinematics of a particle', 'Liquids', 'Magnetic Effects of Current',
    'Modern Physics', 'Properties of Matter', 'Ray Optics and Wave Optics',
    'Rotation and Gravitation', 'SHM', 'Thermodynamics', 'Wave Motion',
    'Work, Power and Energy',
  ],
  Chemistry: [
    'Atomic Structure', 'Chemical Bonding', 'Chemical Equilibrium', 'Chemical Kinetics',
    'Colligative Properties of Solutions', 'Coordination Compounds', 'd-Block Elements',
    'Electrochemistry', 'Gaseous State', 'Hydrogen and s-Block Elements',
    'IOC and Hydrocarbons', 'Ionic Equilibrium', 'Metallurgy',
    'Nitrogen Containing Organic Compounds', 'Organic Halides and Organic Concepts',
    'Oxygen Containing Organic Compound-I', 'Oxygen Containing Organic Compound-II',
    'Oxygen Containing Organic Compounds-III', 'p-Block Element-II', 'p-Block Elements-I',
    'Qualitative Analysis', 'Solid State', 'Stoichiometry-I and II',
    'Surf., Bio., Practical Org. Chem. and Polymers', 'Thermodynamics and Thermochemistry',
  ],
  Mathematics: [
    'Binomial Theorem', 'Circle', 'Complex Numbers', 'Conic Sections',
    'Differential Calculus-1', 'Differential Calculus-2', 'Differential Equations',
    'Functions', 'Integral Calculus-1', 'Integral Calculus-2', 'Matrices and Determinants',
    'Permutation and Combination', 'Probability', 'Quadratic Equations',
    'Sequence and Series', 'Sets Relations Functions', 'Straight Line',
    'Three Dimensional Geometry', 'Trigonometry', 'Vectors',
  ],
  Biology: [],
};

function getQuestionType(q) {
  const key = String(q.q_type || q.type || '').trim().toLowerCase();
  if (MCQ_TYPES.includes(key)) return 'mcq';
  if (NAT_TYPES.includes(key)) return 'nat';
  return Array.isArray(q.options) && q.options.length > 0 ? 'mcq' : 'nat';
}

function getCleanSnippet(q, maxLen = 45) {
  const rawText = (typeof q === 'string') ? q : (q?.question_text || q?.text || '');
  if (!rawText) {
    if (q?.image_url) return '🖼️ [Image Question]';
    return 'Question';
  }
  let clean = rawText
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\mathrm\{([^}]*)\}/g, '$1')
    .replace(/\\mathbf\{([^}]*)\}/g, '$1')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
    .replace(/\\sqrt\{([^}]*)\}/g, '√($1)')
    .replace(/\$+/g, '') // remove math dollar signs
    .replace(/\\[a-zA-Z]+/g, ' ') // remove other latex commands
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length > maxLen) {
    return clean.substring(0, maxLen).trim() + '…';
  }
  return clean || 'Question';
}

const TestConstructor = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const { questions, batches, refreshTests } = useAppData();
  const [step, setStep] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userSubject = user.subject && user.subject !== 'All' ? user.subject : null;

  const [subjectFilter, setSubjectFilter] = useState(userSubject || '');
  const [topicFilter, setTopicFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Topics come from the hardcoded chapter map (same source as QuestionBank)
  const availableTopics = CHAPTERS[subjectFilter] || [];

  // ── Server-side paginated question bank ──────────────────────────────────
  const [bankPage, setBankPage]         = useState(1);
  const [bankPageSize, setBankPageSize] = useState(10);
  const [bankTotal, setBankTotal]       = useState(0);
  const [bankPages, setBankPages]       = useState(1);
  const [bankLoading, setBankLoading]   = useState(false);
  const [bankData, setBankData]         = useState([]);

  // Reset topic filter when subject changes

  // Fetch a page of questions from the server whenever filters/page changes
  useEffect(() => {
    let cancelled = false;
    const fetchBank = async () => {
      setBankLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(bankPage),
          limit: String(bankPageSize),
          review_status: 'all',
        });
        if (subjectFilter || userSubject) params.set('subject', subjectFilter || userSubject);
        if (topicFilter)  params.set('topic', topicFilter);
        if (typeFilter) {
          // Map UI value → possible raw db values so backend eq filter matches
          const typeMap = { mcq: 'single_correct', nat: 'numerical' };
          params.set('q_type', typeMap[typeFilter] || typeFilter);
        }
        if (searchQuery) params.set('search', searchQuery);
        const res = await apiClient.get(`/questions?${params}`);
        if (cancelled) return;
        const rows = Array.isArray(res) ? res : (res?.data ?? []);
        setBankData(rows);
        setBankTotal(res?.total ?? rows.length);
        setBankPages(res?.totalPages ?? 1);
      } catch (e) {
        console.error('Failed to fetch question bank:', e);
      } finally {
        if (!cancelled) setBankLoading(false);
      }
    };
    fetchBank();
    return () => { cancelled = true; };
  }, [bankPage, bankPageSize, subjectFilter, topicFilter, typeFilter, searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => { setBankPage(1); }, [subjectFilter, topicFilter, typeFilter, searchQuery, bankPageSize]);

  // Toast State
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Step 1 State
  const [testData, setTestData] = useState({
    title: '',
    subject: userSubject || 'Physics',
    duration: 60,
    totalMarks: 0,
    negativeMarking: true,
    negativeMarks: 1,
    date: '',
    time: '',
    targetBatches: [],
    t_type: 'quiz'
  });

  const [existingTest, setExistingTest] = useState(null);
  const isInitiator = !existingTest || existingTest.created_by === user.id;

  useEffect(() => {
    if (testId) {
      apiClient.get(`/tests/${testId}`).then(data => {
        setExistingTest(data);
        setTestData(prev => ({
          ...prev,
          title: data.title,
          subject: data.subject || prev.subject,
          t_type: data.paper_pattern || data.t_type || 'quiz',
          duration: data.duration_minutes,
          totalMarks: data.total_marks,
          // Read from the real columns, falling back to the old description
          // convention for tests created before the migration.
          negativeMarking: data.negative_marking ?? !!data.description?.includes('Negative Marking'),
          negativeMarks: data.negative_marks ?? prev.negativeMarks,
        }));
        if (data.test_questions) {
          const qs = data.test_questions.map(tq => ({ ...tq.questions, marks: tq.questions.marks || 4 }));
          setSelectedQuestions(qs);
        }
      }).catch(err => showToast('Failed to load test: ' + err.message));
    }
  }, [testId]);

  // Calculate total marks when questions change
  useEffect(() => {
    const newTotal = selectedQuestions.reduce((sum, q) => sum + (q.marks || 4), 0);
    setTestData(prev => ({ ...prev, totalMarks: newTotal }));
  }, [selectedQuestions]);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const saveToBackend = async (status) => {
    try {
      let scheduledStart = undefined;
      let scheduledEnd = undefined;

      if (testData.date && testData.time) {
        scheduledStart = new Date(`${testData.date}T${testData.time}`).toISOString();
      }

      // Default the close of the window to 7 days out when only a start is given,
      // so the backend's scheduled_end check has something meaningful to enforce.
      if (scheduledStart && !scheduledEnd) {
        scheduledEnd = new Date(
          new Date(scheduledStart).getTime() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString();
      }

      const payload = {
        title: testData.title || 'Untitled Test',
        description: `Subject: ${testData.subject}`,
        subject: testData.subject,
        // May be a plain kind ('quiz') or a pattern ('jee_main'); the API accepts
        // either here and splits them server-side.
        t_type: testData.t_type,
        duration_minutes: parseInt(testData.duration, 10),
        total_marks: testData.totalMarks,
        status: status,
        // Real columns now — grading applies the penalty server-side.
        negative_marking: !!testData.negativeMarking,
        negative_marks: testData.negativeMarking ? Number(testData.negativeMarks) || 0 : 0,
        question_ids: selectedQuestions.map(q => q.id),
        batch_ids: testData.targetBatches,
        scheduled_start: scheduledStart,
        scheduled_end: scheduledEnd
      };

      if (testData.t_type === 'jee_main' && status === 'published') {
        const subjects = [...new Set(selectedQuestions.map(q => q.subject))];
        for (const sub of subjects) {
          const subQs = selectedQuestions.filter(q => q.subject === sub);
          const mcqCount = subQs.filter(q => getQuestionType(q) === 'mcq').length;
          const natCount = subQs.filter(q => getQuestionType(q) === 'nat').length;
          if (mcqCount !== 20 || natCount !== 10) {
            showToast(`Cannot publish: ${sub} has ${mcqCount}/20 MCQs and ${natCount}/10 Numericals.`);
            return;
          }
        }
      }

      if (testId) {
        if (isInitiator) {
          await apiClient.patch(`/tests/${testId}`, {
            title: payload.title,
            description: payload.description,
            subject: payload.subject,
            duration_minutes: payload.duration_minutes,
            total_marks: payload.total_marks,
            negative_marking: payload.negative_marking,
            negative_marks: payload.negative_marks
          });
          if (status === 'published' && existingTest.status === 'draft') {
            await apiClient.patch(`/tests/${testId}/publish`);
          }
          if (payload.batch_ids.length > 0 && scheduledStart) {
            await apiClient.post(`/tests/${testId}/assign`, {
              batch_ids: payload.batch_ids,
              scheduled_start: payload.scheduled_start,
              scheduled_end: payload.scheduled_end
            });
          }
        }
        await apiClient.post(`/tests/${testId}/questions`, { question_ids: payload.question_ids });
      } else {
        await apiClient.post('/tests/constructor', payload);
      }

      await refreshTests();

      showToast(`Test ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
      setTimeout(() => navigate('/teacher/test-library'), 1500);
    } catch (err) {
      console.error(err);
      showToast(`Failed to ${status === 'draft' ? 'save draft' : 'publish'}: ` + err.message);
    }
  };

  const handleSaveDraft = () => saveToBackend('draft');
  const handlePublish = () => saveToBackend('published');

  const toggleQuestion = (q) => {
    if (userSubject && userSubject !== q.subject) {
      showToast(`You can only modify ${userSubject} questions.`);
      return;
    }

    const isJeeMain = testData.t_type === 'jee_main';
    const isSelected = selectedQuestions.find(sq => sq.id === q.id);

    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter(sq => sq.id !== q.id));
    } else {
      if (isJeeMain) {
        const subjectQuestions = selectedQuestions.filter(sq => sq.subject === q.subject);
        const qType = getQuestionType(q);
        const currentCount = subjectQuestions.filter(sq => getQuestionType(sq) === qType).length;
        const limit = qType === 'mcq' ? 20 : 10;

        if (currentCount >= limit) {
          showToast(`Cannot add more than ${limit} ${qType === 'mcq' ? 'MCQ' : 'Numerical'} questions for ${q.subject} in JEE Main pattern.`);
          return;
        }
      }
      setSelectedQuestions([...selectedQuestions, q]);
    }
  };

  const StepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map(s => (
        <React.Fragment key={s}>
          <div className={`step-circle ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
            {step > s ? <Check size={16} /> : s}
          </div>
          {s < 3 && <div className={`step-line ${step > s ? 'active' : ''}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      <div className="test-constructor">
        <header className="page-header d-flex justify-between align-center">
          <div>
            {/* A teacher only ever reaches this page to fill in an assigned
                paper; building one from scratch is an admin action. */}
            <h1>{isInitiator ? 'Test Constructor' : 'Add Questions'}</h1>
            <p>
              {isInitiator
                ? 'Design, build, and publish new assessments.'
                : `Add the ${userSubject ? `${userSubject} ` : ''}questions for this paper.`}
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={handleSaveDraft}>
              {isInitiator ? 'Save Draft' : 'Save Questions'}
            </button>
            {step < 3 ? (
              <button className="btn-primary" onClick={handleNext}>Next Step <ChevronRight size={18} /></button>
            ) : (
              isInitiator ? (
                <button className="btn-primary success-bg" onClick={handlePublish}>Publish Test</button>
              ) : (
                <button className="btn-primary success-bg" onClick={handleSaveDraft}>Save Questions</button>
              )
            )}
          </div>
        </header>

      {toast && <div className="toast-notification">{toast}</div>}

      <div className="constructor-container">
        <div className="constructor-sidebar">
          <StepIndicator />
          <div className="step-labels">
            <div className={`step-label ${step === 1 ? 'active' : ''}`}><Settings size={18} /> 1. Test Metadata</div>
            <div className={`step-label ${step === 2 ? 'active' : ''}`}><ListChecks size={18} /> 2. Add Questions</div>
            <div className={`step-label ${step === 3 ? 'active' : ''}`}><FileText size={18} /> 3. Review & Publish</div>
          </div>
        </div>

        <div className="constructor-content">
          {step === 1 && (
            <div className="step-pane step-1">
              <h2>Test Metadata</h2>
              {!isInitiator && (
                <div style={{ background: '#fef3c7', padding: '10px 15px', borderRadius: '8px', color: '#92400e', marginBottom: '15px' }}>
                  <strong>Collaboration Mode:</strong> You can only add or remove questions for your subject. Only the test initiator can edit metadata or delete this test.
                </div>
              )}
              <div className="form-group">
                <label>Test Title</label>
                <input type="text" placeholder="e.g. Weekly Mock Test #4" value={testData.title} onChange={e => setTestData({ ...testData, title: e.target.value })} disabled={!isInitiator} />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <div className="subject-chips">
                  {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map(sub => (
                    <button
                      key={sub}
                      className={`chip ${testData.subject === sub ? 'active' : ''}`}
                      onClick={() => !userSubject && setTestData({ ...testData, subject: sub })}
                      disabled={userSubject && userSubject !== sub}
                      style={userSubject && userSubject !== sub ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (mins)</label>
                  <input type="number" value={testData.duration} onChange={e => setTestData({ ...testData, duration: e.target.value })} disabled={!isInitiator} />
                </div>
                <div className="form-group">
                  <label>Total Marks (Auto-calculated)</label>
                  <input type="number" value={testData.totalMarks} disabled style={{ backgroundColor: '#f1f5f9' }} />
                </div>
              </div>

              <div className="form-group toggle-group">
                <label className="toggle-label">
                  <input type="checkbox" checked={testData.negativeMarking} onChange={e => setTestData({ ...testData, negativeMarking: e.target.checked })} disabled={!isInitiator} />
                  Enable Negative Marking
                </label>
                {testData.negativeMarking && (
                  <input type="number" className="inline-input" value={testData.negativeMarks} onChange={e => setTestData({ ...testData, negativeMarks: e.target.value })} disabled={!isInitiator} />
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Schedule Date (Optional)</label>
                  <input type="date" value={testData.date} onChange={e => setTestData({ ...testData, date: e.target.value })} disabled={!isInitiator} />
                </div>
                <div className="form-group">
                  <label>Time (Optional)</label>
                  <input type="time" value={testData.time} onChange={e => setTestData({ ...testData, time: e.target.value })} disabled={!isInitiator} />
                </div>
              </div>

              <div className="form-group">
                <label>Target Batches</label>
                <select
                  multiple
                  className="multi-select"
                  value={testData.targetBatches}
                  onChange={e => {
                    const options = Array.from(e.target.selectedOptions, option => option.value);
                    setTestData({ ...testData, targetBatches: options });
                  }}
                  disabled={!isInitiator}
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <span className="help-text">Hold Ctrl/Cmd to select multiple batches.</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-pane step-2">
              <h2>Select Questions</h2>
              <div className="question-builder">
                {/* ── Left: Question Bank Panel ── */}
                <div className="tc-bank-panel">
                  {/* Search input with integrated icon & clear button */}
                  <div className="tc-search-bar">
                    <div className="tc-search-input-wrap">
                      <Search size={16} className="tc-search-icon" />
                      <input
                        type="text"
                        className="tc-search-input"
                        placeholder="Search question bank by keyword..."
                        value={searchQuery}
                        onChange={e => {
                          setSearchQuery(e.target.value);
                          setBankPage(1);
                        }}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          className="tc-search-clear"
                          onClick={() => {
                            setSearchQuery('');
                            setBankPage(1);
                          }}
                          title="Clear search"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Subject Filter Chips */}
                  <div className="tc-subject-chips">
                    <button
                      type="button"
                      className={`tc-chip ${subjectFilter === '' ? 'active' : ''}`}
                      onClick={() => {
                        if (!userSubject) {
                          setSubjectFilter('');
                          setTopicFilter('');
                          setBankPage(1);
                        }
                      }}
                      disabled={!!userSubject}
                    >
                      All Subjects
                    </button>
                    {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map(sub => (
                      <button
                        type="button"
                        key={sub}
                        className={`tc-chip ${subjectFilter === sub ? 'active' : ''}`}
                        onClick={() => {
                          if (!userSubject) {
                            setSubjectFilter(sub);
                            setTopicFilter('');
                            setBankPage(1);
                          }
                        }}
                        disabled={userSubject && userSubject !== sub}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>

                  {/* Topic & Type Dropdown Filters */}
                  <div className="tc-filter-row">
                    <select
                      value={topicFilter}
                      onChange={e => { setTopicFilter(e.target.value); setBankPage(1); }}
                      className="tc-select"
                    >
                      <option value="">All Topics</option>
                      {availableTopics.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    <select
                      value={typeFilter}
                      onChange={e => { setTypeFilter(e.target.value); setBankPage(1); }}
                      className="tc-select"
                    >
                      <option value="">All Types</option>
                      <option value="mcq">MCQ</option>
                      <option value="nat">Numerical</option>
                    </select>
                  </div>

                  {/* Question cards list */}
                  <div className="tc-question-list">
                    {bankLoading && (
                      <div className="tc-loading-state">
                        <div className="tc-spinner" />
                        <p>Loading questions…</p>
                      </div>
                    )}
                    {!bankLoading && bankData.length === 0 && (
                      <div className="tc-empty-state">
                        <p className="tc-empty-title">No questions found</p>
                        <p className="tc-empty-sub">Try adjusting your filters or search keywords.</p>
                      </div>
                    )}
                    {!bankLoading && bankData.map(q => {
                      const isSelected = !!selectedQuestions.find(sq => sq.id === q.id);
                      const qType = getQuestionType(q);
                      const typeLabel = q.type === 'single_correct' ? 'Single Choice'
                        : q.type === 'multi_correct' ? 'Multiple Choice'
                        : q.type === 'numerical' ? 'Numerical'
                        : (qType === 'mcq' ? 'MCQ' : 'Numerical');

                      return (
                        <div key={q.id} className={`tc-q-card ${isSelected ? 'selected' : ''}`}>
                          <div className="tc-q-card-header">
                            <div className="tc-q-badges">
                              <span className="tc-q-subject">{q.subject}</span>
                              <span className="tc-q-type-badge">{typeLabel}</span>
                              {q.topic && <span className="tc-q-topic-badge" title={q.topic}>{q.topic}</span>}
                            </div>
                            <span className={`tc-q-diff ${q.difficulty ? q.difficulty.toLowerCase() : 'medium'}`}>
                              {q.difficulty || 'Medium'}
                            </span>
                          </div>

                          <div className="tc-q-body">
                            {q.image_url ? (
                              <img
                                src={q.image_url}
                                alt="Question"
                                onClick={() => setLightboxUrl(q.image_url)}
                                className="tc-q-image"
                              />
                            ) : (
                              <MathText as="div" className="tc-q-text" text={q.question_text || q.text || ''} />
                            )}
                          </div>

                          <div className="tc-q-footer">
                            <span className="tc-q-marks">{q.marks || 4} Marks</span>
                            <button
                              type="button"
                              className={`tc-btn-action ${isSelected ? 'tc-btn-remove' : 'tc-btn-add'}`}
                              onClick={() => toggleQuestion(q)}
                            >
                              {isSelected ? '✓ Added' : '+ Add Question'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Pagination bar ── */}
                  <div className="tc-pagination-bar">
                    <div className="tc-pagination-info">
                      <span>Rows:</span>
                      <select
                        value={bankPageSize}
                        onChange={e => { setBankPageSize(Number(e.target.value)); setBankPage(1); }}
                        className="tc-pagination-select"
                      >
                        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <span className="tc-pagination-total">({bankTotal} questions)</span>
                    </div>

                    <div className="tc-pagination-nav">
                      <button
                        type="button"
                        className="tc-page-btn"
                        onClick={() => setBankPage(p => Math.max(1, p - 1))}
                        disabled={bankPage === 1}
                        title="Previous page"
                      >
                        ‹
                      </button>

                      {(() => {
                        const pages = [];
                        const total = bankPages;
                        const cur = bankPage;
                        const add = (n) => pages.push(
                          <button
                            type="button"
                            key={n}
                            onClick={() => setBankPage(n)}
                            className={`tc-page-btn ${cur === n ? 'active' : ''}`}
                          >
                            {n}
                          </button>
                        );
                        const ellipsis = (k) => pages.push(<span key={k} className="tc-page-ellipsis">…</span>);

                        if (total <= 7) {
                          for (let i = 1; i <= total; i++) add(i);
                        } else {
                          add(1);
                          if (cur > 4) ellipsis('s');
                          const start = Math.max(2, cur - 2);
                          const end   = Math.min(total - 1, cur + 2);
                          for (let i = start; i <= end; i++) add(i);
                          if (cur < total - 3) ellipsis('e');
                          add(total);
                        }
                        return pages;
                      })()}

                      <button
                        type="button"
                        className="tc-page-btn"
                        onClick={() => setBankPage(p => Math.min(bankPages, p + 1))}
                        disabled={bankPage === bankPages}
                        title="Next page"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Right: Selected Questions Panel ── */}
                <div className="tc-selected-panel">
                  <div className="tc-selected-header">
                    <h3 className="tc-selected-title">
                      Selected Questions
                      <span className="tc-selected-badge">{selectedQuestions.length}</span>
                    </h3>
                  </div>

                  {testData.t_type === 'jee_main' ? (
                    <div className="tc-selected-list">
                      {['Physics', 'Chemistry', 'Mathematics', 'Biology'].map(sub => {
                        const subQs = selectedQuestions.filter(q => q.subject === sub);
                        if (subQs.length === 0 && (!userSubject || userSubject !== sub)) return null;

                        const mcqQs = subQs.filter(q => getQuestionType(q) === 'mcq');
                        const natQs = subQs.filter(q => getQuestionType(q) === 'nat');

                        return (
                          <div key={sub} className="tc-selected-subject-group">
                            <div className="tc-selected-subject-title">{sub}</div>

                            <div className="tc-selected-section">
                              <div className="tc-selected-section-header">
                                <span>Section A (MCQ)</span>
                                <span className={`tc-quota-tag ${mcqQs.length === 20 ? 'full' : mcqQs.length > 20 ? 'overflow' : ''}`}>
                                  {mcqQs.length} / 20
                                </span>
                              </div>
                              {mcqQs.map((q, idx) => (
                                <div key={q.id} className="tc-selected-item">
                                  <span className="tc-selected-num">{idx + 1}.</span>
                                  <span className="tc-selected-snippet" title={q.question_text || q.text || ''}>
                                    {getCleanSnippet(q)}
                                  </span>
                                  {(!userSubject || userSubject === q.subject) && (
                                    <button
                                      type="button"
                                      className="tc-selected-del"
                                      onClick={() => toggleQuestion(q)}
                                      title="Remove question"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {mcqQs.length === 0 && (
                                <p className="tc-selected-empty">No MCQs selected.</p>
                              )}
                            </div>

                            <div className="tc-selected-section">
                              <div className="tc-selected-section-header">
                                <span>Section B (Numerical)</span>
                                <span className={`tc-quota-tag ${natQs.length === 10 ? 'full' : natQs.length > 10 ? 'overflow' : ''}`}>
                                  {natQs.length} / 10
                                </span>
                              </div>
                              {natQs.map((q, idx) => (
                                <div key={q.id} className="tc-selected-item">
                                  <span className="tc-selected-num">{idx + 1}.</span>
                                  <span className="tc-selected-snippet" title={q.question_text || q.text || ''}>
                                    {getCleanSnippet(q)}
                                  </span>
                                  {(!userSubject || userSubject === q.subject) && (
                                    <button
                                      type="button"
                                      className="tc-selected-del"
                                      onClick={() => toggleQuestion(q)}
                                      title="Remove question"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {natQs.length === 0 && (
                                <p className="tc-selected-empty">No Numerical questions selected.</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="tc-selected-list">
                      {selectedQuestions.length === 0 ? (
                        <div className="tc-selected-empty-wrap">
                          <p className="tc-selected-empty">No questions selected yet.</p>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Click "+ Add Question" on any card to add.</span>
                        </div>
                      ) : (
                        selectedQuestions.map((q, idx) => (
                          <div key={q.id} className="tc-selected-item">
                            <span className="tc-selected-num">{idx + 1}.</span>
                            <span className="tc-selected-snippet" title={q.question_text || q.text || ''}>
                              {getCleanSnippet(q)}
                            </span>
                            {(!userSubject || userSubject === q.subject) && (
                              <button
                                type="button"
                                className="tc-selected-del"
                                onClick={() => toggleQuestion(q)}
                                title="Remove question"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-pane step-3">
              <h2>Review Summary</h2>
              <div className="summary-card">
                <div className="summary-header">
                  <h3>{testData.title || 'Untitled Test'}</h3>
                  <span className="subject-badge">{testData.subject}</span>
                </div>

                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">Duration</span>
                    <span className="value">{testData.duration} mins</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Total Marks</span>
                    <span className="value">{testData.totalMarks}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Questions</span>
                    <span className="value">{selectedQuestions.length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Negative Marking</span>
                    <span className="value">{testData.negativeMarking ? `Yes (-${testData.negativeMarks})` : 'No'}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Scheduled</span>
                    <span className="value">{testData.date ? `${testData.date} at ${testData.time}` : 'Unscheduled'}</span>
                  </div>
                </div>

                <div className="summary-section">
                  <h4>Target Batches</h4>
                  <div className="batches-list">
                    {testData.targetBatches.map(bId => {
                      const batch = batches.find(b => b.id === bId);
                      return <span key={bId} className="batch-chip">{batch ? batch.name : bId}</span>
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="step-navigation">
            {step > 1 ? (
              <button className="btn-outline" onClick={handlePrev}><ChevronLeft size={18} /> Previous</button>
            ) : <div></div>}
          </div>
        </div>
      </div>
    </div>

    {/* Image Lightbox */}
    {lightboxUrl && (
      <div
        onClick={() => setLightboxUrl(null)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'zoom-out', padding: '24px'
        }}
      >
        <button
          onClick={() => setLightboxUrl(null)}
          aria-label="Close image preview"
          title="Close image preview"
          style={{
            position: 'absolute', top: '16px', right: '20px',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            color: '#fff', fontSize: '28px', cursor: 'pointer',
            borderRadius: '50%', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1
          }}
        >&times;</button>
        <img
          src={lightboxUrl}
          alt="Question enlarged"
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '90vw', maxHeight: '90vh',
            borderRadius: '8px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            objectFit: 'contain'
          }}
        />
      </div>
    )}
    </>
  );
};

export default TestConstructor;