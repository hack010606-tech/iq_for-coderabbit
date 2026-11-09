import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, X, Check, Sliders, BookOpen, RefreshCw, Layers, ChevronRight, Search 
} from 'lucide-react';
import { apiClient } from '../../api/client';
import './AutoGenerateTestModal.css';

const DIFFICULTY_PRESETS = [
  { id: 'balanced', label: 'Balanced', sub: '30% E · 50% M · 20% H', easy: 30, medium: 50, hard: 20 },
  { id: 'rigor', label: 'High Rigor / Advanced', sub: '10% E · 40% M · 50% H', easy: 10, medium: 40, hard: 50 },
  { id: 'jeemain', label: 'Standard', sub: '20% E · 60% M · 20% H', easy: 20, medium: 60, hard: 20 },
  { id: 'foundation', label: 'Foundation', sub: '60% E · 30% M · 10% H', easy: 60, medium: 30, hard: 10 },
];

export default function AutoGenerateTestModal({
  isOpen,
  onClose,
  subject = 'Physics',
  userSubject = null,
  availableTopics = [],
  currentSelected = [],
  targetTotal = 25,
  targetMcq = 20,
  targetNat = 5,
  patternName = 'JEE Main Pattern',
  onApply,
  showToast
}) {
  if (!isOpen) return null;

  const targetSub = userSubject || (subject && subject !== 'Mixed' ? subject : 'Physics');

  // Question count state (defaults to paper's target quota)
  const [questionCount, setQuestionCount] = useState(targetTotal || 25);
  const [natCount, setNatCount] = useState(targetNat || 5);
  const mcqCount = Math.max(0, questionCount - natCount);

  // Update if props change
  useEffect(() => {
    if (targetTotal) {
      setQuestionCount(targetTotal);
      setNatCount(targetNat);
    }
  }, [targetTotal, targetNat]);

  // Topic selection & search state
  const [topicSearch, setTopicSearch] = useState('');
  const [selectedTopics, setSelectedTopics] = useState(() => {
    if (availableTopics.length >= 3) return [availableTopics[0], availableTopics[1], availableTopics[2]];
    if (availableTopics.length > 0) return [availableTopics[0]];
    return ['Kinematics', 'Dynamics of a Particle', 'Work, Power and Energy'];
  });

  // Sync topics when availableTopics prop loads or changes
  useEffect(() => {
    if (availableTopics.length > 0) {
      setSelectedTopics(prev => {
        if (prev.length === 0 || !prev.some(t => availableTopics.includes(t))) {
          return availableTopics.slice(0, Math.min(3, availableTopics.length));
        }
        return prev;
      });
    }
  }, [availableTopics]);

  // Topic weights (map of topicName -> integer percent)
  const [topicWeights, setTopicWeights] = useState({});

  // Recalculate weights when selectedTopics changes
  useEffect(() => {
    if (selectedTopics.length === 0) {
      setTopicWeights({});
      return;
    }
    const count = selectedTopics.length;
    const base = Math.floor(100 / count);
    const remainder = 100 - base * count;
    const nextWeights = {};
    selectedTopics.forEach((t, idx) => {
      nextWeights[t] = base + (idx === 0 ? remainder : 0);
    });
    setTopicWeights(nextWeights);
  }, [selectedTopics]);

  const handleEqualizeWeights = () => {
    if (selectedTopics.length === 0) return;
    const count = selectedTopics.length;
    const base = Math.floor(100 / count);
    const remainder = 100 - base * count;
    const nextWeights = {};
    selectedTopics.forEach((t, idx) => {
      nextWeights[t] = base + (idx === 0 ? remainder : 0);
    });
    setTopicWeights(nextWeights);
  };

  const handleWeightChange = (topic, val) => {
    const num = Math.max(0, Math.min(100, Number(val) || 0));
    setTopicWeights(prev => ({ ...prev, [topic]: num }));
  };

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length === 1) {
        showToast('At least 1 topic must remain selected.');
        return;
      }
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const filteredTopics = useMemo(() => {
    if (!topicSearch.trim()) return availableTopics;
    return availableTopics.filter(t => t.toLowerCase().includes(topicSearch.toLowerCase()));
  }, [availableTopics, topicSearch]);

  // Difficulty state
  const [diffPreset, setDiffPreset] = useState('rigor');
  const [easyPct, setEasyPct] = useState(10);
  const [medPct, setMedPct] = useState(40);
  const [hardPct, setHardPct] = useState(50);

  const applyDiffPreset = (preset) => {
    setDiffPreset(preset.id);
    setEasyPct(preset.easy);
    setMedPct(preset.medium);
    setHardPct(preset.hard);
  };

  // Mode: Replace vs Append
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to extract integer
  const extractRealInteger = (val) => {
    if (val === null || val === undefined) return null;
    const raw = String(typeof val === 'object' ? (val.value ?? '') : val).trim();
    if (!raw) return null;
    if (/^-?\d+$/.test(raw)) return raw;
    const cleaned = raw
      .replace(/\\text\{[^}]*\}/g, '')
      .replace(/\\mathrm\{[^}]*\}/g, '')
      .replace(/[\$\s]/g, '')
      .replace(/(km\/h|m\/s|cm\/s|m\/s\^2|cm|mm|km|m|s|min|h|kg|g|N|J|W|V|A|C|T|Hz|rad\/s|rad|deg|degrees)/gi, '');
    if (/^-?\d+$/.test(cleaned)) return cleaned;
    return null;
  };

  const isNat = (q) => {
    const key = String(q.q_type || q.type || '').trim().toLowerCase();
    const natTypes = ['nat', 'integer', 'numerical', 'numeric', 'int'];
    if (natTypes.includes(key) && extractRealInteger(q.correct_answer) !== null) return true;
    return false;
  };

  const isMcq = (q) => {
    return !isNat(q) && q.q_type !== 'subjective' && (Array.isArray(q.options) && q.options.length > 0);
  };

  // ── Generation Handler ──
  const handleGenerate = async (proceedToReview = false) => {
    if (selectedTopics.length === 0) {
      showToast('Please select at least one topic.');
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Fetch available questions strictly for this teacher's subject (exclude subjective questions client-side)
      const subjectParam = targetSub && targetSub !== 'All' ? `subject=${encodeURIComponent(targetSub)}&` : '';
      const [res1, res2] = await Promise.all([
        apiClient.get(`/questions?${subjectParam}limit=150&page=1&review_status=all`),
        apiClient.get(`/questions?${subjectParam}limit=150&page=2&review_status=all`).catch(() => ({ data: [] }))
      ]);
      const list1 = Array.isArray(res1) ? res1 : (res1?.data ?? []);
      const list2 = Array.isArray(res2) ? res2 : (res2?.data ?? []);
      // Filter strictly by targetSub and exclude subjective questions
      const bank = [...list1, ...list2].filter(q => {
        if (q.q_type === 'subjective') return false;
        if (!targetSub || targetSub === 'All') return true;
        return String(q.subject || '').toLowerCase() === targetSub.toLowerCase();
      });

      if (!bank || bank.length === 0) {
        showToast('No questions found in question bank for ' + targetSub);
        setIsGenerating(false);
        return;
      }

      // Existing already chosen IDs of THIS subject if appending
      const existingIds = replaceExisting 
        ? new Set() 
        : new Set(
            currentSelected
              .filter(q => !targetSub || String(q.subject || '').toLowerCase() === targetSub.toLowerCase())
              .map(q => q.id)
          );

      const targetTotalNum = questionCount;
      const targetNatNum   = natCount;
      const targetMcqNum   = mcqCount;

      // Classify pool
      const availablePool = bank.filter(q => !existingIds.has(q.id));

      const norm = s => String(s || '').trim().toLowerCase();
      const isTopicMatch = (qTopic, t) => {
        if (!qTopic) return false;
        const a = norm(qTopic);
        const b = norm(t);
        return a === b || a.includes(b) || b.includes(a);
      };

      // Group questions by topic & type
      const questionsByTopic = {};
      selectedTopics.forEach(t => {
        questionsByTopic[t] = {
          mcq: availablePool.filter(q => (isTopicMatch(q.topic, t) || (!q.topic && t === selectedTopics[0])) && isMcq(q)),
          nat: availablePool.filter(q => (isTopicMatch(q.topic, t) || (!q.topic && t === selectedTopics[0])) && isNat(q)),
        };
      });

      // Subject-level fallback pools
      const subjectMcqs = availablePool.filter(q => isMcq(q));
      const subjectNats = availablePool.filter(q => isNat(q));

      // Calculate question allocation per topic
      const totalWeight = Object.values(topicWeights).reduce((a, b) => a + b, 0) || 100;
      const chosen = [];
      const chosenIds = new Set();

      // Allocate numericals first across topics
      let natsNeeded = targetNatNum;
      for (const topic of selectedTopics) {
        if (natsNeeded <= 0) break;
        const weight = topicWeights[topic] || 0;
        const topicNatQuota = Math.max(1, Math.round(targetNatNum * (weight / totalWeight)));

        const pool = questionsByTopic[topic]?.nat || [];
        for (const q of pool) {
          if (!chosenIds.has(q.id) && natsNeeded > 0 && chosen.filter(x => isNat(x)).length < targetNatNum) {
            chosen.push({ ...q, subject: q.subject || targetSub, marks: 4 });
            chosenIds.add(q.id);
            natsNeeded--;
          }
        }
      }

      // If still need numericals, take from general subject pool
      if (natsNeeded > 0) {
        for (const q of subjectNats) {
          if (!chosenIds.has(q.id) && natsNeeded > 0) {
            chosen.push({ ...q, subject: q.subject || targetSub, marks: 4 });
            chosenIds.add(q.id);
            natsNeeded--;
          }
        }
      }

      // Allocate MCQs across topics based on weightage
      let mcqsNeeded = targetMcqNum;
      for (const topic of selectedTopics) {
        if (mcqsNeeded <= 0) break;
        const weight = topicWeights[topic] || 0;
        const topicMcqQuota = Math.round(targetMcqNum * (weight / totalWeight));

        const pool = questionsByTopic[topic]?.mcq || [];
        // Sort pool with difficulty bias (hard vs med vs easy)
        pool.sort((a, b) => {
          const diffScore = { hard: 3, medium: 2, easy: 1 };
          return (diffScore[b.difficulty] || 2) - (diffScore[a.difficulty] || 2);
        });

        let topicTaken = 0;
        for (const q of pool) {
          if (!chosenIds.has(q.id) && mcqsNeeded > 0 && topicTaken < topicMcqQuota) {
            const isMulti = q.q_type === 'multi_correct';
            const marks = isMulti ? 4 : (q.marks || 4);
            chosen.push({ ...q, subject: q.subject || targetSub, marks });
            chosenIds.add(q.id);
            mcqsNeeded--;
            topicTaken++;
          }
        }
      }

      // If still need MCQs, fill from subject MCQs pool
      if (mcqsNeeded > 0) {
        for (const q of subjectMcqs) {
          if (!chosenIds.has(q.id) && mcqsNeeded > 0) {
            chosen.push({ ...q, subject: q.subject || targetSub, marks: q.marks || 4 });
            chosenIds.add(q.id);
            mcqsNeeded--;
          }
        }
      }

      // If still need questions to reach targetTotalNum, take any available valid questions
      let remaining = targetTotalNum - chosen.length;
      if (remaining > 0) {
        for (const q of availablePool) {
          if (!chosenIds.has(q.id) && remaining > 0 && (isMcq(q) || isNat(q))) {
            chosen.push({ ...q, subject: q.subject || targetSub, marks: q.marks || 4 });
            chosenIds.add(q.id);
            remaining--;
          }
        }
      }

      if (chosen.length === 0) {
        showToast('No matching questions could be found in question bank.');
        setIsGenerating(false);
        return;
      }

      // Build strictly scoped question list for this teacher
      const currentSubjectQuestions = currentSelected.filter(
        q => !targetSub || String(q.subject || '').toLowerCase() === targetSub.toLowerCase()
      );

      const finalSelection = replaceExisting
        ? chosen
        : [...currentSubjectQuestions, ...chosen];

      // Send to parent TestConstructor
      onApply(finalSelection, proceedToReview);
      showToast(`✨ Successfully auto-filled ${chosen.length} ${targetSub} questions into paper!`);
      onClose();
    } catch (err) {
      console.error('Auto-generation failed:', err);
      showToast('Auto-fill error: ' + (err.message || 'Failed to select questions'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="agm-overlay" onClick={onClose}>
      <div className="agm-modal" onClick={e => e.stopPropagation()}>
        {/* ── Modal Header ── */}
        <div className="agm-header">
          <div className="agm-header-left">
            <div className="agm-badge-icon">
              <Sparkles size={24} />
            </div>
            <div>
              <h2>Auto-Generate Test Questions</h2>
              <p>Automate question selection for {subject} based on topic weightage & difficulty</p>
            </div>
          </div>
          <button className="agm-close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div className="agm-body">
          {/* Target Count & Format Bar */}
          <div className="agm-section" style={{ padding: '12px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={18} color="#6366f1" />
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b' }}>
                  Target Format: <span style={{ color: '#6366f1' }}>{patternName}</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Total Questions:
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={questionCount}
                    onChange={e => setQuestionCount(Math.max(1, Number(e.target.value) || 1))}
                    style={{ width: '56px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '700', textAlign: 'center' }}
                  />
                </label>
                <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Numericals:
                  <input
                    type="number"
                    min="0"
                    max={questionCount}
                    value={natCount}
                    onChange={e => setNatCount(Math.max(0, Math.min(questionCount, Number(e.target.value) || 0)))}
                    style={{ width: '50px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '700', textAlign: 'center' }}
                  />
                </label>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#64748b' }}>
                  (MCQs: <strong style={{ color: '#1e293b' }}>{mcqCount}</strong>)
                </span>
              </div>
            </div>
          </div>

          {/* 1. Topic Selection & Weightage */}
          <div className="agm-section">
            <div className="agm-section-title">
              <h3>
                <BookOpen size={20} color="#6366f1" />
                <span>1. Syllabus Topics & Weightage Distribution</span>
              </h3>
              <div className="agm-title-actions">
                <span className="agm-pill-badge">{selectedTopics.length} Selected</span>
                <button
                  type="button"
                  className="agm-btn-quick-topic"
                  onClick={() => setSelectedTopics(availableTopics)}
                  title="Select all chapters in syllabus"
                >
                  Select All
                </button>
                <button
                  type="button"
                  className="agm-btn-quick-topic"
                  onClick={() => {
                    if (availableTopics.length > 0) setSelectedTopics([availableTopics[0]]);
                  }}
                  title="Reset to 1 chapter"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="agm-topic-search-wrap">
              <Search size={18} className="agm-search-icon" />
              <input
                type="text"
                className="agm-topic-search-input"
                placeholder="Search chapters & topics (e.g., Kinematics, Thermodynamics, Electrostatics)..."
                value={topicSearch}
                onChange={e => setTopicSearch(e.target.value)}
              />
              {topicSearch && (
                <button
                  type="button"
                  className="agm-search-clear-btn"
                  onClick={() => setTopicSearch('')}
                  title="Clear search"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Topics Chips */}
            <div className="agm-topics-scroll">
              {filteredTopics.map(topic => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    className={`agm-topic-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTopic(topic)}
                  >
                    {isSelected && <Check size={14} className="agm-chip-check-icon" />}
                    <span>{topic}</span>
                  </button>
                );
              })}
            </div>

            {/* Topic Weightage Sliders */}
            {selectedTopics.length > 0 && (
              <div className="agm-weightage-container">
                <div className="agm-weightage-header">
                  <span>Topic Weightage (% of test questions allocated)</span>
                  <button
                    type="button"
                    className="agm-btn-equalize"
                    onClick={handleEqualizeWeights}
                    title="Split 100% equally among selected topics"
                  >
                    <RefreshCw size={12} />
                    <span>Equalize Weightage</span>
                  </button>
                </div>

                {selectedTopics.map(topic => {
                  const weight = topicWeights[topic] || 0;
                  const estimatedQs = Math.round(questionCount * (weight / 100));
                  return (
                    <div key={topic} className="agm-weight-row">
                      <div className="agm-weight-topic-name" title={topic}>
                        {topic}
                      </div>
                      <div className="agm-weight-slider-wrap">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={weight}
                          onChange={e => handleWeightChange(topic, e.target.value)}
                          className="agm-weight-slider"
                        />
                        <span className="agm-weight-pct">{weight}%</span>
                        <span className="agm-weight-qs-badge">~{estimatedQs} Qs</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Difficulty Target */}
          <div className="agm-section">
            <div className="agm-section-title">
              <h3>
                <Sliders size={18} color="#6366f1" />
                <span>2. Question Difficulty Target</span>
              </h3>
            </div>

            <div className="agm-diff-presets">
              {DIFFICULTY_PRESETS.map(preset => {
                const isAct = diffPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`agm-diff-btn ${isAct ? 'active' : ''}`}
                    onClick={() => applyDiffPreset(preset)}
                  >
                    <span className="agm-diff-title">{preset.label}</span>
                    <span className="agm-diff-sub">{preset.sub}</span>
                  </button>
                );
              })}
            </div>

            <div className="agm-diff-sliders">
              <div className="agm-diff-slider-item">
                <div className="agm-diff-slider-label">
                  <span>Easy</span>
                  <span>{easyPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={easyPct}
                  onChange={e => {
                    setEasyPct(Number(e.target.value));
                    setDiffPreset('custom');
                  }}
                />
              </div>

              <div className="agm-diff-slider-item">
                <div className="agm-diff-slider-label">
                  <span>Medium</span>
                  <span>{medPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={medPct}
                  onChange={e => {
                    setMedPct(Number(e.target.value));
                    setDiffPreset('custom');
                  }}
                />
              </div>

              <div className="agm-diff-slider-item">
                <div className="agm-diff-slider-label">
                  <span>Hard</span>
                  <span>{hardPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hardPct}
                  onChange={e => {
                    setHardPct(Number(e.target.value));
                    setDiffPreset('custom');
                  }}
                />
              </div>
            </div>
          </div>

          {/* Live Summary Bar */}
          <div className="agm-summary-box">
            <div className="agm-summary-stat">
              <span className="label">Exam Pattern</span>
              <span className="val">{patternName}</span>
            </div>
            <div className="agm-summary-divider" />
            <div className="agm-summary-stat">
              <span className="label">Total Questions</span>
              <span className="val">{questionCount} Qs</span>
            </div>
            <div className="agm-summary-divider" />
            <div className="agm-summary-stat">
              <span className="label">MCQs / Numericals</span>
              <span className="val">{mcqCount} / {natCount}</span>
            </div>
            <div className="agm-summary-divider" />
            <div className="agm-summary-stat">
              <span className="label">Topics Selected</span>
              <span className="val">{selectedTopics.length} Chapters</span>
            </div>
            <div className="agm-summary-divider" />
            <div className="agm-summary-stat">
              <span className="label">Estimated Marks</span>
              <span className="val">{questionCount * 4} pts</span>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="agm-footer">
          <label className="agm-mode-toggle">
            <input
              type="checkbox"
              checked={replaceExisting}
              onChange={e => setReplaceExisting(e.target.checked)}
            />
            <span>Clear existing {targetSub} questions & replace with new auto-fill</span>
          </label>

          <div className="agm-footer-actions">
            <button type="button" className="agm-btn-cancel" onClick={onClose} disabled={isGenerating}>
              Cancel
            </button>
            <button
              type="button"
              className="agm-btn-submit"
              onClick={() => handleGenerate(false)}
              disabled={isGenerating || selectedTopics.length === 0}
              title="Auto-fill questions and stay on current step"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Selecting...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Auto-Fill Questions</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="agm-btn-submit agm-btn-review"
              onClick={() => handleGenerate(true)}
              disabled={isGenerating || selectedTopics.length === 0}
              title="Auto-fill questions and immediately proceed to Step 3 Review"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Selecting...</span>
                </>
              ) : (
                <>
                  <span>Auto-Fill & Review</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
