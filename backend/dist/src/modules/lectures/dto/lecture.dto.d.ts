export declare class CreateLectureDto {
    title: string;
    subject: string;
    topic?: string;
    drive_url: string;
    duration_minutes?: number;
}
export declare class LectureQueryDto {
    subject?: string;
    topic?: string;
    page?: number;
    limit?: number;
}
