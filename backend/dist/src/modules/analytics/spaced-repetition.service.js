"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SpacedRepetitionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpacedRepetitionService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../../config/supabase.config");
const query_util_1 = require("../../common/db/query.util");
const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;
const RISK_ACCURACY_THRESHOLD = 50;
const RISK_MIN_SAMPLE = 5;
let SpacedRepetitionService = SpacedRepetitionService_1 = class SpacedRepetitionService {
    logger = new common_1.Logger(SpacedRepetitionService_1.name);
    async processAttempt(attemptId, studentId) {
        try {
            const answers = await this.loadGradedAnswers(attemptId);
            if (!answers.length)
                return;
            await this.updateSrsState(studentId, answers);
            await this.recomputePredictions(studentId);
        }
        catch (e) {
            this.logger.error(`SRS update failed for attempt ${attemptId}: ${e?.message}`);
        }
    }
    async loadGradedAnswers(attemptId) {
        const { data } = await supabase_config_1.supabase
            .from('answers')
            .select('question_id, is_correct, time_spent_seconds, questions(subject, topic, marks)')
            .eq('attempt_id', attemptId);
        return (data || []).map((a) => ({
            question_id: a.question_id,
            is_correct: a.is_correct,
            time_spent_seconds: a.time_spent_seconds,
            subject: a.questions?.subject || 'Unknown',
            topic: a.questions?.topic || null,
            marks: Number(a.questions?.marks) || 4,
        }));
    }
    quality(answer) {
        if (answer.is_correct === null)
            return 1;
        if (!answer.is_correct)
            return 2;
        const seconds = Number(answer.time_spent_seconds) || 0;
        if (seconds > 0 && seconds <= 45)
            return 5;
        if (seconds > 0 && seconds <= 120)
            return 4;
        return 3;
    }
    async updateSrsState(studentId, answers) {
        const questionIds = answers.map((a) => a.question_id);
        const existingRows = await (0, query_util_1.fetchAllIn)(questionIds, (idChunk) => supabase_config_1.supabase
            .from('spaced_repetition_state')
            .select('question_id, repetitions, ease_factor, interval_days, mastery_level')
            .eq('student_id', studentId)
            .in('question_id', idChunk));
        const existing = new Map(existingRows.map((r) => [r.question_id, r]));
        const now = Date.now();
        const rows = answers.map((answer) => {
            const prev = existing.get(answer.question_id);
            const q = this.quality(answer);
            let repetitions = Number(prev?.repetitions) || 0;
            let ease = Number(prev?.ease_factor) || DEFAULT_EASE;
            let intervalDays = Number(prev?.interval_days) || 0;
            if (q < 3) {
                repetitions = 0;
                intervalDays = 1;
            }
            else {
                repetitions += 1;
                if (repetitions === 1)
                    intervalDays = 1;
                else if (repetitions === 2)
                    intervalDays = 6;
                else
                    intervalDays = Math.round(intervalDays * ease) || 1;
            }
            ease = Math.max(MIN_EASE, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
            const prevMastery = Number(prev?.mastery_level) || 0;
            const observed = q / 5;
            const mastery = Number((prevMastery * 0.7 + observed * 0.3).toFixed(3));
            const dueAt = new Date(now + intervalDays * 24 * 60 * 60 * 1000);
            const priority = Number(((1 - mastery) * 10 + 1 / (intervalDays || 1)).toFixed(3));
            return {
                student_id: studentId,
                question_id: answer.question_id,
                repetitions,
                ease_factor: Number(ease.toFixed(2)),
                interval_days: intervalDays,
                due_at: dueAt.toISOString(),
                mastery_level: mastery,
                priority_weight: priority,
                last_reviewed_at: new Date(now).toISOString(),
                updated_at: new Date(now).toISOString(),
            };
        });
        await (0, query_util_1.insertInBatches)(rows, (batch) => supabase_config_1.supabase
            .from('spaced_repetition_state')
            .upsert(batch, { onConflict: 'student_id,question_id' })).catch((e) => {
            throw new Error(`SRS upsert failed: ${e.message}`);
        });
    }
    async recomputePredictions(studentId) {
        const attempts = await (0, query_util_1.fetchAll)(() => supabase_config_1.supabase
            .from('attempts')
            .select('id')
            .eq('student_id', studentId)
            .eq('status', 'submitted'));
        const attemptIds = attempts.map((a) => a.id);
        if (!attemptIds.length)
            return;
        const answers = await (0, query_util_1.fetchAllIn)(attemptIds, (idChunk) => supabase_config_1.supabase
            .from('answers')
            .select('is_correct, questions(subject, topic, marks)')
            .in('attempt_id', idChunk));
        if (!answers.length)
            return;
        const buckets = new Map();
        const bump = (subject, topic, correct, marks) => {
            const key = `${subject}::${topic ?? ''}`;
            if (!buckets.has(key)) {
                buckets.set(key, { subject, topic, correct: 0, total: 0, marks: 0 });
            }
            const b = buckets.get(key);
            b.total += 1;
            b.marks += marks;
            if (correct)
                b.correct += 1;
        };
        for (const a of answers) {
            const subject = a.questions?.subject || 'Unknown';
            const topic = a.questions?.topic || null;
            const marks = Number(a.questions?.marks) || 4;
            const correct = a.is_correct === true;
            bump(subject, null, correct, marks);
            if (topic)
                bump(subject, topic, correct, marks);
        }
        const rows = Array.from(buckets.values()).map((b) => {
            const accuracy = b.total > 0 ? (b.correct / b.total) * 100 : 0;
            return {
                student_id: studentId,
                subject: b.subject,
                topic: b.topic ?? '',
                predicted_score: Number(((accuracy / 100) * b.marks).toFixed(2)),
                accuracy: Number(accuracy.toFixed(2)),
                sample_size: b.total,
                risk_flag: b.total >= RISK_MIN_SAMPLE && accuracy < RISK_ACCURACY_THRESHOLD,
                computed_at: new Date().toISOString(),
            };
        });
        const { error } = await supabase_config_1.supabase
            .from('predictions')
            .upsert(rows, { onConflict: 'student_id,subject,topic' });
        if (error)
            throw new Error(`Predictions upsert failed: ${error.message}`);
    }
    async getDueQuestions(studentId, limit = 20) {
        const { data, error } = await supabase_config_1.supabase
            .from('spaced_repetition_state')
            .select('question_id, due_at, mastery_level, priority_weight, questions(id, subject, topic, question_text, difficulty, image_url)')
            .eq('student_id', studentId)
            .lte('due_at', new Date().toISOString())
            .order('priority_weight', { ascending: false })
            .limit(limit);
        if (error)
            throw new Error(error.message);
        return data || [];
    }
};
exports.SpacedRepetitionService = SpacedRepetitionService;
exports.SpacedRepetitionService = SpacedRepetitionService = SpacedRepetitionService_1 = __decorate([
    (0, common_1.Injectable)()
], SpacedRepetitionService);
//# sourceMappingURL=spaced-repetition.service.js.map