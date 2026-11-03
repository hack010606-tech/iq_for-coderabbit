import { CreateLectureDto, LectureQueryDto } from './dto/lecture.dto';
export interface Requester {
    id: string;
    role?: string;
}
export declare class LecturesService {
    findAll(filters: LectureQueryDto): Promise<{
        data: {
            id: any;
            subject: any;
            topic: any;
            title: any;
            drive_url: any;
            duration_minutes: any;
            created_at: any;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    create(body: CreateLectureDto, teacherId: string): Promise<any>;
    remove(id: string, user: Requester): Promise<{
        message: string;
    }>;
    getSyllabus(subject: string): Promise<{
        id: any;
        subject: any;
        topic: any;
        subtopic: any;
        order_index: any;
    }[]>;
    private escapeLike;
}
