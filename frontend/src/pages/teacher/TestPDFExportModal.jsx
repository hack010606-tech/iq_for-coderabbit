import React, { useState } from 'react';
import { X, Printer, Check, CheckCircle2, FileText, FileDown } from 'lucide-react';
import MathText from '../../components/MathText';
import './TestPDFExportModal.css';

export const TestPDFExportModal = ({ isOpen, onClose, testData = {}, selectedQuestions = [] }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getAnswerDisplay = (q) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const ans = q.correct_answer;
    if (ans?.value !== undefined && ans?.value !== null && ans?.value !== '') {
      return String(ans.value);
    }
    if (Array.isArray(ans?.indices) && ans.indices.length > 0) {
      return ans.indices.map(i => letters[i] ?? `Option ${i + 1}`).join(', ');
    }
    if (Array.isArray(ans?.letters) && ans.letters.length > 0) {
      return ans.letters.join(', ');
    }
    if (ans?.letter) {
      return String(ans.letter);
    }
    if (ans?.index !== undefined && ans?.index !== null) {
      return letters[ans.index] ?? `Option ${ans.index + 1}`;
    }
    if (typeof ans === 'string' || typeof ans === 'number') {
      return String(ans);
    }
    return '—';
  };

  const isOptionCorrect = (q, idx) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const ans = q.correct_answer;
    if (ans?.index !== undefined && ans?.index !== null) return ans.index === idx;
    if (ans?.letter) return ans.letter.toUpperCase() === letters[idx];
    if (Array.isArray(ans?.indices)) return ans.indices.includes(idx);
    if (Array.isArray(ans?.letters)) return ans.letters.includes(letters[idx]);
    if (typeof ans === 'string' && /^[A-F]$/i.test(ans.trim())) {
      return ans.trim().toUpperCase() === letters[idx];
    }
    return false;
  };

  const totalCalculatedMarks = selectedQuestions.reduce((s, q) => s + (q.marks || 4), 0);

  return (
    <div className="tc-pdf-modal-overlay">
      {/* ── Top Toolbar (Hidden during print) ── */}
      <div className="tc-pdf-toolbar">
        <div className="tc-pdf-toolbar-left">
          <div className="tc-pdf-icon-wrap">
            <FileText size={20} />
          </div>
          <div>
            <h3>PDF Export Preview</h3>
            <span className="tc-pdf-meta-hint">
              {testData.title || 'Assessment'} · {selectedQuestions.length} Questions · {totalCalculatedMarks} Marks
            </span>
          </div>
        </div>

        <div className="tc-pdf-toolbar-right">
          <label className="tc-pdf-toggle">
            <input
              type="checkbox"
              checked={showAnswers}
              onChange={e => setShowAnswers(e.target.checked)}
            />
            <span>Include Answer Key</span>
          </label>

          <label className="tc-pdf-toggle">
            <input
              type="checkbox"
              checked={showSolutions}
              onChange={e => setShowSolutions(e.target.checked)}
            />
            <span>Include Solutions</span>
          </label>

          <button
            type="button"
            className="tc-pdf-btn-print"
            onClick={handlePrint}
            title="Open browser print dialog to save as PDF or print"
          >
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>

          <button
            type="button"
            className="tc-pdf-btn-close"
            onClick={onClose}
            aria-label="Close PDF preview"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Printable Document Container ── */}
      <div className="tc-pdf-doc-container">
        <div className="tc-pdf-page">
          {/* Header */}
          <div className="tc-exam-header">
            <div className="tc-exam-inst-title">INSTITUTE QUESTION ASSESSMENT</div>
            <h1 className="tc-exam-title">{testData.title || 'Examination Paper'}</h1>

            <div className="tc-exam-meta-grid">
              <div className="tc-exam-meta-item">
                <strong>Subject:</strong> {testData.subject || 'All Subjects'}
              </div>
              <div className="tc-exam-meta-item">
                <strong>Duration:</strong> {testData.duration || 180} Minutes
              </div>
              <div className="tc-exam-meta-item">
                <strong>Total Marks:</strong> {testData.totalMarks || totalCalculatedMarks}
              </div>
              <div className="tc-exam-meta-item">
                <strong>Questions:</strong> {selectedQuestions.length}
              </div>
              {testData.negativeMarking && (
                <div className="tc-exam-meta-item tc-negative">
                  <strong>Negative Marking:</strong> −{testData.negativeMarks || 1} per incorrect response
                </div>
              )}
            </div>

            {/* Candidate details fill line */}
            <div className="tc-exam-candidate-line">
              <div className="tc-cand-field">
                <span>Candidate Name:</span>
                <span className="tc-cand-underline"></span>
              </div>
              <div className="tc-cand-field" style={{ maxWidth: '200px' }}>
                <span>Roll No:</span>
                <span className="tc-cand-underline"></span>
              </div>
              <div className="tc-cand-field" style={{ maxWidth: '160px' }}>
                <span>Date:</span>
                <span className="tc-cand-underline"></span>
              </div>
            </div>

            {/* General Instructions */}
            <div className="tc-exam-instructions">
              <strong>General Instructions:</strong>
              <ol>
                <li>All questions are compulsory unless specified otherwise.</li>
                <li>Each question carries the marks indicated against it.</li>
                <li>Use of any electronic or digital calculation devices is strictly prohibited.</li>
              </ol>
            </div>
          </div>

          <div className="tc-exam-divider"></div>

          {/* Numbered Questions */}
          {selectedQuestions.length === 0 ? (
            <div className="tc-pdf-empty">No questions selected for this test paper.</div>
          ) : (
            <div className="tc-pdf-questions-list">
              {selectedQuestions.map((q, idx) => {
                const rawOptions = Array.isArray(q.options) ? q.options : [];
                const hasOptions = rawOptions.length > 0;

                return (
                  <div key={q.id || idx} className="tc-pdf-q-item">
                    <div className="tc-pdf-q-header">
                      <span className="tc-pdf-q-num">Q{idx + 1}.</span>
                      <div className="tc-pdf-q-text">
                        <MathText text={q.question_text || q.text || ''} />
                      </div>
                      <span className="tc-pdf-q-marks">[{q.marks || 4} Marks]</span>
                    </div>

                    {q.image_url && (
                      <div className="tc-pdf-q-image-wrap">
                        <img src={q.image_url} alt={`Diagram for Q${idx + 1}`} className="tc-pdf-q-image" />
                      </div>
                    )}

                    {hasOptions && (
                      <div className="tc-pdf-options-grid">
                        {rawOptions.map((opt, optIdx) => {
                          const optLetter = ['A', 'B', 'C', 'D', 'E', 'F'][optIdx] || String(optIdx + 1);
                          const optText = typeof opt === 'string' ? opt : (opt?.text ?? String(opt));
                          const isCorrect = isOptionCorrect(q, optIdx);

                          return (
                            <div
                              key={optIdx}
                              className={`tc-pdf-opt ${showAnswers && isCorrect ? 'tc-pdf-opt-correct' : ''}`}
                            >
                              <span className="tc-pdf-opt-label">({optLetter})</span>
                              <div className="tc-pdf-opt-text">
                                <MathText text={optText} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {showSolutions && q.solution && (
                      <div className="tc-pdf-solution-box">
                        <strong>Solution:</strong>
                        <MathText text={q.solution} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Answer Key Section (when checked) */}
          {showAnswers && selectedQuestions.length > 0 && (
            <div className="tc-pdf-answer-key-section">
              <div className="tc-exam-divider"></div>
              <h2 className="tc-pdf-key-title">ANSWER KEY & EVALUATION GUIDE</h2>
              <div className="tc-pdf-key-grid">
                {selectedQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="tc-pdf-key-cell">
                    <span className="tc-key-q">Q{idx + 1}:</span>
                    <strong className="tc-key-ans">
                      <MathText text={getAnswerDisplay(q)} />
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Paper Footer */}
          <div className="tc-pdf-page-footer">
            <span>{testData.title || 'Assessment'}</span>
            <span>End of Question Paper</span>
            <span>Total Questions: {selectedQuestions.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPDFExportModal;
