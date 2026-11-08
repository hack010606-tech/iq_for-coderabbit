import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, FileText } from 'lucide-react';
import { apiClient } from '../../api/client';
import TestPDFExportModal from './TestPDFExportModal';
import './PDFPreviewModal.css';

/**
 * Printable exam paper.
 * Renders a full subject-wise exam paper preview with print/save as PDF support.
 */
const PDFPreviewModal = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const testId = params.get('testId');

  const [test, setTest] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');
      try {
        if (testId) {
          const data = await apiClient.get(`/tests/${testId}`);
          if (!cancelled) setTest(data);
        } else {
          // No test chosen — offer a picker
          const list = await apiClient.getList('/tests');
          if (!cancelled) setTests(list);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load the test.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [testId]);

  if (loading) return <div className="pdf-preview-page"><p className="pv-muted">Loading…</p></div>;

  // Picker shown when no test id was supplied.
  if (!testId) {
    return (
      <div className="pdf-preview-page">
        <div className="preview-toolbar">
          <div className="toolbar-left"><h2>Print a Test</h2></div>
          <div className="toolbar-right">
            <button className="icon-close" onClick={() => navigate(-1)}><X size={24} /></button>
          </div>
        </div>

        <div className="pv-picker">
          {error && <p className="pv-error">{error}</p>}
          {tests.length === 0 ? (
            <div className="pv-empty">
              <FileText size={38} />
              <p>No tests available to print yet.</p>
            </div>
          ) : (
            <ul className="pv-test-list">
              {tests.map((t) => (
                <li key={t.id}>
                  <button onClick={() => navigate(`/teacher/pdf-preview?testId=${t.id}`)}>
                    <span className="pv-test-title">{t.title}</span>
                    <span className="pv-muted pv-small">
                      {t.duration_minutes} min · {t.total_marks} marks · {t.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="pdf-preview-page">
        <p className="pv-error">{error || 'Test not found.'}</p>
        <button className="btn-outline" onClick={() => navigate('/teacher/test-library')}>
          Back to Test Library
        </button>
      </div>
    );
  }

  const questions = (test.test_questions || [])
    .map(tq => ({
      ...(tq.questions || {}),
      marks: tq.marks_override || tq.questions?.marks || 4,
      question_order: tq.question_order,
    }))
    .sort((a, b) => (a.question_order || 0) - (b.question_order || 0));

  return (
    <TestPDFExportModal
      isOpen={true}
      onClose={() => navigate(-1)}
      testData={test}
      selectedQuestions={questions}
    />
  );
};

export default PDFPreviewModal;
