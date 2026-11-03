import { LecturesService } from './lectures.service';
import { CreateLectureDto, LectureQueryDto } from './dto/lecture.dto';
export declare class LecturesController {
    private readonly lecturesService;
    constructor(lecturesService: LecturesService);
    findAll(query: LectureQueryDto): Promise<{
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
    getSyllabus(subject: string): Promise<{
        id: any;
        subject: any;
        topic: any;
        subtopic: any;
        order_index: any;
    }[]>;
    create(body: CreateLectureDto, user: any): Promise<any>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
