"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LecturesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_config_1 = require("../../config/supabase.config");
let LecturesService = class LecturesService {
    async findAll(filters) {
        const page = Math.max(Number(filters.page) || 1, 1);
        const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 200);
        const from = (page - 1) * limit;
        let query = supabase_config_1.supabase
            .from('lectures')
            .select('id, subject, topic, title, drive_url, duration_minutes, created_at', {
            count: 'exact',
        })
            .order('created_at', { ascending: false })
            .range(from, from + limit - 1);
        if (filters.subject)
            query = query.eq('subject', filters.subject);
        if (filters.topic)
            query = query.ilike('topic', `%${this.escapeLike(filters.topic)}%`);
        const { data, error, count } = await query;
        if (error)
            throw new Error(error.message);
        const total = count ?? 0;
        return {
            data: data || [],
            total,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        };
    }
    async create(body, teacherId) {
        const { data, error } = await supabase_config_1.supabase
            .from('lectures')
            .insert({
            title: body.title.trim(),
            subject: body.subject,
            topic: body.topic ?? null,
            drive_url: body.drive_url,
            duration_minutes: body.duration_minutes ?? null,
            uploaded_by: teacherId,
        })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async remove(id, user) {
        const { data: lecture } = await supabase_config_1.supabase
            .from('lectures')
            .select('id, uploaded_by')
            .eq('id', id)
            .single();
        if (!lecture)
            throw new common_1.NotFoundException('Lecture not found');
        if (user.role !== 'admin' && lecture.uploaded_by !== user.id) {
            throw new common_1.ForbiddenException('Only the teacher who uploaded this lecture can delete it.');
        }
        const { error } = await supabase_config_1.supabase.from('lectures').delete().eq('id', id);
        if (error)
            throw new Error(error.message);
        return { message: 'Lecture deleted' };
    }
    async getSyllabus(subject) {
        const { data, error } = await supabase_config_1.supabase
            .from('syllabus_items')
            .select('id, subject, topic, subtopic, order_index')
            .eq('subject', subject)
            .order('order_index', { ascending: true });
        if (error)
            throw new Error(error.message);
        return data;
    }
    escapeLike(value) {
        return value.replace(/[%_\\]/g, (m) => `\\${m}`);
    }
};
exports.LecturesService = LecturesService;
exports.LecturesService = LecturesService = __decorate([
    (0, common_1.Injectable)()
], LecturesService);
//# sourceMappingURL=lectures.service.js.map