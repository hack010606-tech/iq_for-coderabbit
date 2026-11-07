import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  ArrowRight,
  Plus,
  Calendar,
  Sparkles,
  Layers,
  UserPlus,
  FileQuestion,
  Database
} from 'lucide-react';
import { apiClient, toList } from '../../api/client';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    batches: 0,
    tests: 0,
  });

  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [allUsers, batches, testsRes] = await Promise.allSettled([
          apiClient.get('/users/admin/all'),
          apiClient.get('/batches'),
          apiClient.get('/tests?limit=20'),
        ]);

        const users = allUsers.status === 'fulfilled' ? toList(allUsers.value) : [];
        const batchList = batches.status === 'fulfilled' ? toList(batches.value) : [];

        let testList = [];
        let totalTests = 0;
        if (testsRes.status === 'fulfilled') {
          const val = testsRes.value;
          testList = toList(val);
          totalTests = val?.total ?? testList.length;
        }

        setStats({
          students: users.filter((u) => u.role === 'student').length,
          teachers: users.filter((u) => u.role === 'teacher').length,
          batches: batchList.length,
          tests: totalTests,
        });

        setRecentTests(testList.slice(0, 5));
      } catch (e) {
        console.error('Failed loading admin dashboard data', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const kpis = [
    {
      label: 'Total Students',
      value: stats.students,
      sub: 'Enrolled across batches',
      icon: Users,
      color: '#0284c7',
      bg: '#e0f2fe',
      pill: 'Active',
      pillBg: '#f0f9ff',
      pillColor: '#0369a1',
    },
    {
      label: 'Faculty Members',
      value: stats.teachers,
      sub: 'Educators assigned',
      icon: GraduationCap,
      color: '#059669',
      bg: '#d1fae5',
      pill: 'Staff',
      pillBg: '#ecfdf5',
      pillColor: '#047857',
    },
    {
      label: 'Active Batches',
      value: stats.batches,
      sub: 'Classroom cohorts',
      icon: BookOpen,
      color: '#d97706',
      bg: '#fef3c7',
      pill: 'Cohorts',
      pillBg: '#fffbeb',
      pillColor: '#b45309',
    },
    {
      label: 'Exams & Tests',
      value: stats.tests,
      sub: 'Published & drafts',
      icon: ClipboardList,
      color: '#7c3aed',
      bg: '#ede9fe',
      pill: 'Assessments',
      pillBg: '#f5f3ff',
      pillColor: '#6d28d9',
    },
  ];

  const quickActions = [
    {
      title: 'Initiate Test',
      desc: 'Create exam shells (JEE Main/Adv) and assign faculty per subject.',
      to: '/admin/test-initiation',
      icon: Sparkles,
      color: '#7c3aed',
      bg: '#f5f3ff',
    },
    {
      title: 'Question Bank',
      desc: 'Search LaTeX formulas, preview solutions, or bulk upload PDF exams.',
      to: '/admin/question-bank',
      icon: Database,
      color: '#0284c7',
      bg: '#f0f9ff',
    },
    {
      title: 'Manage Batches',
      desc: 'Organize student groups, assign batch tests, and manage schedules.',
      to: '/admin/batches',
      icon: Layers,
      color: '#d97706',
      bg: '#fffbeb',
    },
    {
      title: 'User Management',
      desc: 'Enroll students, invite teachers, and manage institutional roles.',
      to: '/admin/users',
      icon: UserPlus,
      color: '#059669',
      bg: '#ecfdf5',
    },
  ];

  return (
    <div className="admin-page admin-dash-container">
      {/* ── 1. Hero Command Header ── */}
      <div className="admin-dash-hero">
        <div className="admin-dash-hero-content">
          <div className="admin-dash-pill">
            <span className="pulse-dot" />
            Admin Command Center
          </div>
          <h1 className="admin-dash-title">
            Welcome back, {user.full_name?.split(' ')[0] || 'Super Admin'}! 👋
          </h1>
          <p className="admin-dash-subtitle">
            Centralized oversight of faculty allocations, student cohorts, test lifecycles, and question repositories.
          </p>
        </div>

        <div className="admin-dash-hero-actions">
          <div className="admin-dash-date-badge">
            <Calendar size={14} />
            <span>{todayStr}</span>
          </div>
          <div className="admin-dash-hero-btn-row">
            <Link to="/admin/test-initiation" className="admin-hero-btn admin-hero-btn-primary">
              <Plus size={16} />
              Initiate Test
            </Link>
            <Link to="/admin/users" className="admin-hero-btn admin-hero-btn-secondary">
              <UserPlus size={16} />
              Add User
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. KPI Cards Grid (4 Cards) ── */}
      <div className="admin-dash-kpi-grid">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="admin-kpi-box">
              <div className="admin-kpi-box-top">
                <div className="admin-kpi-icon-wrap" style={{ background: k.bg, color: k.color }}>
                  <Icon size={22} />
                </div>
                <span
                  className="admin-kpi-pill"
                  style={{ background: k.pillBg, color: k.pillColor }}
                >
                  {k.pill}
                </span>
              </div>
              <div>
                <div className="admin-kpi-value">{loading ? '—' : k.value.toLocaleString()}</div>
                <div className="admin-kpi-label">{k.label}</div>
                <div className="admin-kpi-sub">{k.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. Quick Action Hub (Command Tiles) ── */}
      <div className="admin-action-tiles-grid">
        {quickActions.map((act) => {
          const Icon = act.icon;
          return (
            <Link key={act.title} to={act.to} className="admin-action-tile">
              <div className="admin-tile-top">
                <div className="admin-tile-icon" style={{ background: act.bg, color: act.color }}>
                  <Icon size={22} />
                </div>
                <ArrowRight size={18} className="admin-tile-arrow" />
              </div>
              <div className="admin-tile-body">
                <h4>{act.title}</h4>
                <p>{act.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── 4. Recent Tests Pipeline (Full Width) ── */}
      <div className="admin-dash-card">
        <div className="admin-dash-card-header">
          <div className="admin-dash-card-title-wrap">
            <ClipboardList size={20} color="#7c3aed" />
            <h3>Recent Tests Pipeline</h3>
            <span className="admin-dash-card-badge">{recentTests.length} recent</span>
          </div>
          <Link to="/admin/test-initiation" className="admin-dash-view-all">
            View all tests <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '28px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Loading test pipeline...
          </div>
        ) : recentTests.length === 0 ? (
          <div style={{ padding: '36px 0', textAlign: 'center' }}>
            <FileQuestion size={36} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, fontWeight: 500 }}>No tests initiated yet.</p>
            <Link
              to="/admin/test-initiation"
              style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#7c3aed', fontWeight: 600 }}
            >
              + Initiate your first test
            </Link>
          </div>
        ) : (
          <div className="test-pipeline-list">
            {recentTests.map((t) => {
              const qList = t.test_questions || [];
              const isNeet = String(t.paper_pattern || t.t_type || '').includes('neet');
              const physQ = qList.filter((q) => q.questions?.subject === 'Physics').length;
              const chemQ = qList.filter((q) => q.questions?.subject === 'Chemistry').length;
              const mathQ = qList.filter((q) => q.questions?.subject === 'Mathematics').length;
              const bioQ  = qList.filter((q) => q.questions?.subject === 'Biology').length;
              const patternLabel = (t.paper_pattern || t.t_type || 'Custom').replace(/_/g, ' ').toUpperCase();

              return (
                <div key={t.id} className="test-pipeline-item">
                  <div className="test-pipeline-header">
                    <div>
                      <div className="test-pipeline-title">{t.title}</div>
                      <div className="test-pipeline-meta">
                        <span className="test-pipeline-pattern-tag">{patternLabel}</span>
                        <span>• {t.duration_minutes || (isNeet ? 200 : 180)} mins</span>
                        <span>• {qList.length} total Qs</span>
                      </div>
                    </div>
                    <span
                      className={`test-status-pill ${
                        t.status === 'published' ? 'test-status-published' : 'test-status-draft'
                      }`}
                    >
                      {t.status || 'Draft'}
                    </span>
                  </div>

                  <div className="test-subject-progress-row">
                    <div className="test-sub-chip">
                      <span className="test-sub-name">Phys:</span>
                      <span className="test-sub-count" style={{ color: physQ > 0 ? '#0284c7' : '#94a3b8' }}>
                        {physQ}
                      </span>
                    </div>
                    <div className="test-sub-chip">
                      <span className="test-sub-name">Chem:</span>
                      <span className="test-sub-count" style={{ color: chemQ > 0 ? '#7c3aed' : '#94a3b8' }}>
                        {chemQ}
                      </span>
                    </div>
                    {isNeet ? (
                      <div className="test-sub-chip">
                        <span className="test-sub-name">Bio:</span>
                        <span className="test-sub-count" style={{ color: bioQ > 0 ? '#10b981' : '#94a3b8' }}>
                          {bioQ}
                        </span>
                      </div>
                    ) : (
                      <div className="test-sub-chip">
                        <span className="test-sub-name">Math:</span>
                        <span className="test-sub-count" style={{ color: mathQ > 0 ? '#d97706' : '#94a3b8' }}>
                          {mathQ}
                        </span>
                      </div>
                    )}
                    <Link to="/admin/test-initiation" className="test-pipeline-btn">
                      Manage <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
