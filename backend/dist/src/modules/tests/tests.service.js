"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../../config/supabase.config");
const supabase_error_1 = require("../../common/db/supabase-error");
const query_util_1 = require("../../common/db/query.util");
const CLOCK_GRACE_SECONDS = 30;
const WRITABLE_COLUMNS = [
    'title',
    'description',
    'subject',
    'duration_minutes',
    'negative_marking',
    'negative_marks',
    'instructions',
];
const TEST_TYPE_VALUES = ['quiz', 'mock_test', 'assignment', 'exam'];
const PAPER_PATTERNS = ['jee_main', 'jee_advanced', 'neet', 'custom'];
const PATTERN_TO_TYPE = {
    jee_main: 'mock_test',
    jee_advanced: 'mock_test',
    neet: 'mock_test',
    custom: 'quiz',
};
let TestsService = TestsService_1 = class TestsService {
    logger = new common_1.Logger(TestsService_1.name);
    hasPaperPattern = null;
    async loadForAccess(testId) {
        const { data: test } = await supabase_config_1.supabase
            .from('tests')
            .select('id, created_by, status')
            .eq('id', testId)
            .single();
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        return test;
    }
    async assertCanAdminister(testId, user) {
        const test = await this.loadForAccess(testId);
        if (user.role === 'admin' || test.created_by === user.id)
            return test;
        throw new common_1.ForbiddenException('Only an admin or the teacher who created this test can change it.');
    }
    async assertCanContribute(testId, user) {
        const test = await this.loadForAccess(testId);
        if (user.role === 'admin' || test.created_by === user.id)
            return test;
        const { data: collaborator } = await supabase_config_1.supabase
            .from('test_teachers')
            .select('teacher_id')
            .eq('test_id', testId)
            .eq('teacher_id', user.id)
            .maybeSingle();
        if (collaborator)
            return test;
        throw new common_1.ForbiddenException('You do not have access to this test.');
    }
    async assertStudentMaySit(testId, studentId, { requireOpen = true } = {}) {
        const { data: test } = await supabase_config_1.supabase
            .from('tests')
            .select('id, status')
            .eq('id', testId)
            .single();
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        if (test.status !== 'published') {
            throw new common_1.ForbiddenException('This test is not available.');
        }
        const { data: rows, error } = await supabase_config_1.supabase
            .from('test_assignments')
            .select('scheduled_start, scheduled_end')
            .eq('test_id', testId)
            .eq('student_id', studentId);
        if (error)
            throw new Error(error.message);
        if (!rows?.length)
            throw new common_1.ForbiddenException('You are not assigned to this test.');
        if (!requireOpen)
            return;
        const starts = rows.map((r) => (r.scheduled_start ? new Date(r.scheduled_start).getTime() : null));
        const ends = rows.map((r) => (r.scheduled_end ? new Date(r.scheduled_end).getTime() : null));
        const opensAt = starts.includes(null) ? null : Math.min(...starts);
        const closesAt = ends.includes(null) ? null : Math.max(...ends);
        const now = Date.now();
        const grace = CLOCK_GRACE_SECONDS * 1000;
        if (opensAt !== null && now < opensAt - grace) {
            throw new common_1.ForbiddenException(`This test opens at ${new Date(opensAt).toISOString()}.`);
        }
        if (closesAt !== null && now > closesAt + grace) {
            throw new common_1.ForbiddenException('The window for this test has closed.');
        }
    }
    pickWritable(body) {
        const out = {};
        for (const key of WRITABLE_COLUMNS) {
            if (body?.[key] !== undefined)
                out[key] = body[key];
        }
        if (out.negative_marking === false)
            out.negative_marks = 0;
        Object.assign(out, this.resolveTypeAndPattern(body));
        return out;
    }
    resolveTypeAndPattern(body) {
        const raw = String(body?.paper_pattern ?? body?.t_type ?? '').trim().toLowerCase();
        if (!raw)
            return {};
        if (TEST_TYPE_VALUES.includes(raw)) {
            return { t_type: raw };
        }
        if (PAPER_PATTERNS.includes(raw)) {
            return { t_type: PATTERN_TO_TYPE[raw], paper_pattern: raw };
        }
        throw new common_1.BadRequestException(`Unknown test type "${raw}". Expected one of: ${[...TEST_TYPE_VALUES, ...PAPER_PATTERNS].join(', ')}.`);
    }
    async insertTest(row) {
        const { data, error } = await supabase_config_1.supabase.from('tests').insert(row).select().single();
        if (!error) {
            if (this.hasPaperPattern === null && 'paper_pattern' in row)
                this.hasPaperPattern = true;
            return data;
        }
        if ('paper_pattern' in row && this.isMissingColumn(error)) {
            if (this.hasPaperPattern === null) {
                this.hasPaperPattern = false;
                this.logger.warn('tests.paper_pattern is missing — run backend/migrations/007_test_paper_pattern.sql. ' +
                    'Paper patterns will not be stored until then.');
            }
            const { paper_pattern: _dropped, ...withoutPattern } = row;
            const retry = await supabase_config_1.supabase.from('tests').insert(withoutPattern).select().single();
            if (retry.error)
                (0, supabase_error_1.throwSupabaseError)(retry.error, 'tests.insert');
            return retry.data;
        }
        (0, supabase_error_1.throwSupabaseError)(error, 'tests.insert');
    }
    isMissingColumn(error) {
        const code = String(error?.code || '');
        if (code === 'PGRST204' || code === '42703')
            return true;
        return /column .* does not exist|schema cache/i.test(String(error?.message || ''));
    }
    async paperPatternAvailable() {
        if (this.hasPaperPattern !== null)
            return this.hasPaperPattern;
        const { error } = await supabase_config_1.supabase.from('tests').select('paper_pattern').limit(1);
        if (!error) {
            this.hasPaperPattern = true;
            return true;
        }
        if (this.isMissingColumn(error)) {
            this.hasPaperPattern = false;
            this.logger.warn('tests.paper_pattern is missing — run backend/migrations/007_test_paper_pattern.sql. ' +
                'Paper patterns will not be stored or returned until then.');
            return false;
        }
        this.logger.warn(`Could not probe tests.paper_pattern: ${error.message}`);
        return false;
    }
    async withPattern(columns) {
        return (await this.paperPatternAvailable()) ? `${columns}, paper_pattern` : columns;
    }
    attachInferredPattern(t) {
        if (!t)
            return t;
        if (!t.paper_pattern) {
            const text = `${t.title || ''} ${t.description || ''} ${t.instructions || ''} ${t.t_type || ''}`.toLowerCase();
            if (text.includes('jee main') || text.includes('jee_main')) {
                t.paper_pattern = 'jee_main';
            }
            else if (text.includes('jee advanced') || text.includes('jee_advanced') || text.includes('jee adv')) {
                t.paper_pattern = 'jee_advanced';
            }
            else if (text.includes('neet')) {
                t.paper_pattern = 'neet';
            }
            else if (t.t_type && t.t_type !== 'mock_test') {
                t.paper_pattern = t.t_type;
            }
        }
        return t;
    }
    async findAll(user, filters = {}) {
        const page = Math.max(Number(filters.page) || 1, 1);
        const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 200);
        const from = (page - 1) * limit;
        const base = await this.withPattern(`id, title, description, instructions, subject, t_type, status, duration_minutes,
       total_marks, negative_marking, negative_marks, created_at, created_by`);
        let query = supabase_config_1.supabase
            .from('tests')
            .select(`${base},
        test_teachers(teacher_id, subject, users(id, full_name, email)),
        test_questions(question_id, questions(subject))`, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, from + limit - 1);
        if (filters.status)
            query = query.eq('status', filters.status);
        const { data, error, count } = await query;
        if (error)
            throw new Error(error.message);
        const total = count ?? 0;
        return {
            data: (data || []).map((t) => {
                const enriched = this.attachInferredPattern(t);
                return {
                    ...enriched,
                    questionCount: enriched.test_questions?.length ?? 0,
                    question_count: enriched.test_questions?.length ?? 0,
                };
            }),
            total,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        };
    }
    async findOne(id, user) {
        if (user.role === 'student') {
            await this.assertStudentMaySit(id, user.id);
        }
        else {
            await this.assertCanContribute(id, user);
        }
        const base = await this.withPattern(`id, title, description, instructions, subject, t_type, status, duration_minutes, total_marks,
       negative_marking, negative_marks, created_at, created_by`);
        const { data, error } = await supabase_config_1.supabase
            .from('tests')
            .select(`${base},
        test_questions(question_order, marks_override, questions(id, subject, topic, question_text, options, correct_answer, difficulty, q_type, marks, image_url))`)
            .eq('id', id)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Test not found');
        return this.attachInferredPattern(data);
    }
    async create(body, user) {
        const data = await this.insertTest({
            ...this.pickWritable(body),
            created_by: user.id,
            status: 'draft',
            total_marks: 0,
        });
        const ids = Array.isArray(body.teacher_ids) ? body.teacher_ids : [];
        if (ids.length > 0) {
            const { error: teacherError } = await supabase_config_1.supabase
                .from('test_teachers')
                .insert(ids.map((tid) => ({ test_id: data.id, teacher_id: tid })));
            if (teacherError) {
                this.logger.error(`Test ${data.id} created but teacher assignment failed: ${teacherError.message}`);
                return {
                    ...data,
                    teacherAssignmentWarning: 'Test created, but teacher assignment failed. Please assign teachers again.',
                };
            }
        }
        return data;
    }
    async assignTeachers(testId, teacherIds) {
        const { data: test } = await supabase_config_1.supabase.from('tests').select('id').eq('id', testId).single();
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        const { error: delError } = await supabase_config_1.supabase
            .from('test_teachers')
            .delete()
            .eq('test_id', testId);
        if (delError)
            throw new Error(delError.message);
        if (teacherIds.length > 0) {
            const { error: insError } = await supabase_config_1.supabase
                .from('test_teachers')
                .insert(teacherIds.map((tid) => ({ test_id: testId, teacher_id: tid })));
            if (insError)
                throw new Error(insError.message);
        }
        const { data, error } = await supabase_config_1.supabase
            .from('tests')
            .select('id, title, test_teachers(teacher_id, users(id, full_name, email))')
            .eq('id', testId)
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async update(id, body, user) {
        await this.assertCanAdminister(id, user);
        const { data, error } = await supabase_config_1.supabase
            .from('tests')
            .update({ ...this.pickWritable(body), updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async remove(id, user) {
        await this.assertCanAdminister(id, user);
        const attempts = await (0, query_util_1.fetchAll)(() => supabase_config_1.supabase.from('attempts').select('id').eq('test_id', id));
        if (attempts.length) {
            const attemptIds = attempts.map((a) => a.id);
            await (0, query_util_1.runInChunks)(attemptIds, (ids) => supabase_config_1.supabase.from('answers').delete().in('attempt_id', ids));
            await (0, query_util_1.runInChunks)(attemptIds, (ids) => supabase_config_1.supabase.from('attempt_violations').delete().in('attempt_id', ids)).catch(() => undefined);
        }
        await supabase_config_1.supabase.from('attempts').delete().eq('test_id', id);
        await supabase_config_1.supabase.from('test_assignments').delete().eq('test_id', id);
        await supabase_config_1.supabase.from('test_questions').delete().eq('test_id', id);
        await supabase_config_1.supabase.from('test_teachers').delete().eq('test_id', id);
        const { error } = await supabase_config_1.supabase.from('tests').delete().eq('id', id);
        if (error)
            throw new Error(error.message);
        return { message: 'Test deleted' };
    }
    async addQuestions(testId, questionIds, user) {
        await this.assertCanContribute(testId, user);
        const ids = questionIds ?? [];
        const { data: existingTestQuestions } = await supabase_config_1.supabase
            .from('test_questions')
            .select('question_id')
            .eq('test_id', testId);
        const existingIds = (existingTestQuestions || []).map((tq) => tq.question_id);
        const touched = [
            ...ids.filter((id) => !existingIds.includes(id)),
            ...existingIds.filter((id) => !ids.includes(id)),
        ];
        const isDraft = (await supabase_config_1.supabase.from('tests').select('status').eq('id', testId).single())?.data?.status === 'draft';
        await this.assertQuestionsUsable(ids, touched, user, isDraft);
        const rows = ids.map((qId, idx) => ({
            test_id: testId,
            question_id: qId,
            question_order: idx + 1,
        }));
        const previousRows = (existingTestQuestions || []).map((tq, idx) => ({
            test_id: testId,
            question_id: tq.question_id,
            question_order: idx + 1,
        }));
        await supabase_config_1.supabase.from('test_questions').delete().eq('test_id', testId);
        if (rows.length) {
            const { error } = await supabase_config_1.supabase.from('test_questions').insert(rows);
            if (error) {
                if (previousRows.length) {
                    try {
                        await supabase_config_1.supabase.from('test_questions').insert(previousRows);
                    }
                    catch {
                    }
                }
                throw new Error(error.message);
            }
        }
        const totalMarks = await this.recalculateTotalMarks(testId);
        return { message: 'Questions updated', total_marks: totalMarks };
    }
    async assertQuestionsUsable(questionIds, scopeCheckIds, user, skipApproval = false) {
        const scoped = user.role === 'teacher' && user.subject && user.subject !== 'All' ? user.subject : null;
        const idsToLoad = [...new Set([...questionIds, ...scopeCheckIds])];
        if (!idsToLoad.length)
            return;
        const rows = await (0, query_util_1.fetchAllIn)(idsToLoad, (idChunk) => supabase_config_1.supabase.from('questions').select('id, subject, review_status, is_active').in('id', idChunk));
        const byId = new Map(rows.map((r) => [r.id, r]));
        for (const id of questionIds) {
            const q = byId.get(id);
            if (!q)
                throw new common_1.BadRequestException(`Question ${id} does not exist.`);
            if (!q.is_active)
                throw new common_1.BadRequestException('A selected question has been deleted.');
            if (!skipApproval && q.review_status !== 'approved') {
                throw new common_1.BadRequestException('Every question on a test must be approved in the review queue first.');
            }
        }
        if (scoped) {
            for (const id of scopeCheckIds) {
                const q = byId.get(id);
                if (q && String(q.subject).toLowerCase() !== scoped.toLowerCase()) {
                    throw new common_1.ForbiddenException(`You can only add or remove ${scoped} questions.`);
                }
            }
        }
    }
    async recalculateTotalMarks(testId) {
        const questions = await (0, query_util_1.fetchAll)(() => supabase_config_1.supabase
            .from('test_questions')
            .select('marks_override, questions(marks)')
            .eq('test_id', testId));
        const totalMarks = questions.reduce((sum, tq) => sum + Number(tq.marks_override || tq.questions?.marks || 4), 0);
        await supabase_config_1.supabase.from('tests').update({ total_marks: totalMarks }).eq('id', testId);
        return totalMarks;
    }
    async publish(id, user) {
        await this.assertCanAdminister(id, user);
        const { data: tqRows, count, error: tqError } = await supabase_config_1.supabase
            .from('test_questions')
            .select('question_id', { count: 'exact' })
            .eq('test_id', id);
        if (tqError)
            throw new Error(tqError.message);
        const questionIds = (tqRows || []).map((tq) => tq.question_id).filter(Boolean);
        if (!count && !questionIds.length) {
            throw new common_1.BadRequestException('Add at least one question before publishing this test.');
        }
        if (questionIds.length) {
            await this.assertQuestionsUsable(questionIds, questionIds, user, false);
        }
        const { data, error } = await supabase_config_1.supabase
            .from('tests')
            .update({ status: 'published', updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async assign(testId, body, user) {
        await this.assertCanAdminister(testId, user);
        this.assertWindowSane(body.scheduled_start, body.scheduled_end);
        const assignments = await this.buildAssignments(testId, body.batch_ids, body.scheduled_start, body.scheduled_end);
        if (!assignments.length) {
            throw new common_1.BadRequestException('No students found in the selected batches');
        }
        await this.replaceAssignments(testId, assignments);
        return { message: `Test assigned to ${assignments.length} students` };
    }
    async buildAssignments(testId, batchIds, scheduledStart, scheduledEnd) {
        const byStudent = new Map();
        for (const batchId of batchIds) {
            const students = await (0, query_util_1.fetchAll)(() => supabase_config_1.supabase.from('batch_students').select('student_id').eq('batch_id', batchId));
            for (const bs of students) {
                if (byStudent.has(bs.student_id))
                    continue;
                byStudent.set(bs.student_id, {
                    test_id: testId,
                    batch_id: batchId,
                    student_id: bs.student_id,
                    scheduled_start: scheduledStart ?? null,
                    scheduled_end: scheduledEnd ?? null,
                });
            }
        }
        return [...byStudent.values()];
    }
    async replaceAssignments(testId, assignments) {
        const studentIds = assignments.map((a) => a.student_id);
        await (0, query_util_1.runInChunks)(studentIds, (ids) => supabase_config_1.supabase.from('test_assignments').delete().eq('test_id', testId).in('student_id', ids), query_util_1.ID_CHUNK_SIZE);
        await (0, query_util_1.insertInBatches)(assignments, (batch) => supabase_config_1.supabase.from('test_assignments').insert(batch));
    }
    assertWindowSane(start, end) {
        if (start && end && new Date(end).getTime() <= new Date(start).getTime()) {
            throw new common_1.BadRequestException('The exam window must end after it starts.');
        }
    }
    async getStudentTests(studentId) {
        const assignments = await (0, query_util_1.fetchAll)(() => supabase_config_1.supabase
            .from('test_assignments')
            .select('id, scheduled_start, scheduled_end, test_id, batch_id')
            .eq('student_id', studentId)
            .order('scheduled_start', { ascending: true }));
        if (!assignments.length)
            return [];
        const studentTestColumns = await this.withPattern('id, title, description, t_type, duration_minutes, total_marks, status');
        const testIds = [...new Set(assignments.map((a) => a.test_id))];
        const tests = await (0, query_util_1.fetchAllIn)(testIds, (idChunk) => supabase_config_1.supabase
            .from('tests')
            .select(studentTestColumns)
            .in('id', idChunk)
            .eq('status', 'published'));
        const testMap = new Map(tests.map((t) => [t.id, t]));
        return assignments
            .filter((a) => testMap.has(a.test_id))
            .map((a) => ({ ...a, tests: testMap.get(a.test_id) }));
    }
    async getTestQuestionsForStudent(testId, studentId) {
        await this.assertStudentMaySit(testId, studentId);
        return (0, query_util_1.fetchAll)(() => supabase_config_1.supabase
            .from('test_questions')
            .select(`
          question_order, marks_override,
          questions(id, subject, topic, question_text, options, difficulty, q_type, image_url, marks)
        `)
            .eq('test_id', testId)
            .order('question_order', { ascending: true }));
    }
    async getResults(testId, user) {
        await this.assertCanContribute(testId, user);
        const { data: test } = await supabase_config_1.supabase
            .from('tests')
            .select('id, title, total_marks, duration_minutes')
            .eq('id', testId)
            .single();
        if (!test)
            throw new common_1.NotFoundException('Test not found');
        const rows = await (0, query_util_1.fetchAll)(() => supabase_config_1.supabase
            .from('attempts')
            .select(`
          id, total_score, status, started_at, submitted_at, auto_submitted,
          users(id, full_name, email)
        `)
            .eq('test_id', testId)
            .eq('status', 'submitted')
            .order('total_score', { ascending: false })
            .order('id', { ascending: true }));
        const scores = rows.map((a) => Number(a.total_score) || 0);
        const maxMarks = Number(test.total_marks) || 0;
        const { count: assignedCount } = await supabase_config_1.supabase
            .from('test_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('test_id', testId);
        const sorted = [...scores].sort((a, b) => a - b);
        const median = sorted.length
            ? sorted.length % 2
                ? sorted[(sorted.length - 1) / 2]
                : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : 0;
        const questionStats = await this.buildQuestionStats(rows.map((a) => a.id));
        let lastScore = null;
        let lastRank = 0;
        return {
            test,
            summary: {
                submitted: rows.length,
                assigned: assignedCount ?? 0,
                notAttempted: Math.max(0, (assignedCount ?? 0) - rows.length),
                maxMarks,
                highest: sorted.length ? sorted[sorted.length - 1] : 0,
                lowest: sorted.length ? sorted[0] : 0,
                average: scores.length
                    ? Number((scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2))
                    : 0,
                median: Number(median.toFixed(2)),
                autoSubmitted: rows.filter((a) => a.auto_submitted).length,
            },
            results: rows.map((a, idx) => {
                const score = Number(a.total_score) || 0;
                const rank = score === lastScore ? lastRank : idx + 1;
                lastScore = score;
                lastRank = rank;
                return {
                    ...a,
                    rank,
                    percentage: maxMarks > 0 ? Math.round((score / maxMarks) * 100) : 0,
                };
            }),
            questionStats,
        };
    }
    async buildQuestionStats(attemptIds) {
        if (!attemptIds.length)
            return [];
        const answers = await (0, query_util_1.fetchAllIn)(attemptIds, (idChunk) => supabase_config_1.supabase
            .from('answers')
            .select('question_id, is_correct, questions(question_text, subject, topic)')
            .in('attempt_id', idChunk));
        const byQuestion = new Map();
        for (const ans of answers) {
            const id = ans.question_id;
            if (!byQuestion.has(id)) {
                byQuestion.set(id, {
                    questionId: id,
                    questionText: ans.questions?.question_text || '',
                    subject: ans.questions?.subject || 'Unknown',
                    topic: ans.questions?.topic || null,
                    correct: 0,
                    incorrect: 0,
                    unattempted: 0,
                });
            }
            const stat = byQuestion.get(id);
            if (ans.is_correct === true)
                stat.correct += 1;
            else if (ans.is_correct === false)
                stat.incorrect += 1;
            else
                stat.unattempted += 1;
        }
        const stats = [...byQuestion.values()].map((stat) => {
            const answered = stat.correct + stat.incorrect;
            return { ...stat, accuracy: answered > 0 ? Math.round((stat.correct / answered) * 100) : 0 };
        });
        return stats.sort((a, b) => a.accuracy - b.accuracy);
    }
    async saveFullTest(body, user) {
        const questionIds = body.question_ids ?? [];
        const batchIds = body.batch_ids ?? [];
        const targetStatus = body.status === 'published' ? 'published' : 'draft';
        this.assertWindowSane(body.scheduled_start, body.scheduled_end);
        await this.assertQuestionsUsable(questionIds, questionIds, user, targetStatus === 'draft');
        if (targetStatus === 'published' && !questionIds.length) {
            throw new common_1.BadRequestException('Add at least one question before publishing this test.');
        }
        const test = await this.insertTest({
            ...this.pickWritable(body),
            status: 'draft',
            total_marks: 0,
            created_by: user.id,
        });
        const testId = test.id;
        try {
            if (questionIds.length) {
                const qRows = questionIds.map((qId, idx) => ({
                    test_id: testId,
                    question_id: qId,
                    question_order: idx + 1,
                }));
                await (0, query_util_1.insertInBatches)(qRows, (batch) => supabase_config_1.supabase.from('test_questions').insert(batch));
            }
            const totalMarks = await this.recalculateTotalMarks(testId);
            if (batchIds.length) {
                const assignments = await this.buildAssignments(testId, batchIds, body.scheduled_start, body.scheduled_end);
                if (assignments.length)
                    await this.replaceAssignments(testId, assignments);
            }
            const { data: finalTest, error: statusError } = await supabase_config_1.supabase
                .from('tests')
                .update({ status: targetStatus, total_marks: totalMarks })
                .eq('id', testId)
                .select()
                .single();
            if (statusError)
                throw new Error(statusError.message);
            return finalTest;
        }
        catch (e) {
            await this.remove(testId, { id: user.id, role: 'admin' }).catch(() => undefined);
            throw e;
        }
    }
};
exports.TestsService = TestsService;
exports.TestsService = TestsService = TestsService_1 = __decorate([
    (0, common_1.Injectable)()
], TestsService);
//# sourceMappingURL=tests.service.js.map