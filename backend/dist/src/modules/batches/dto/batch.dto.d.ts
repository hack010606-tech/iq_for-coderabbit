export declare class CreateBatchDto {
    name: string;
    subject_focus?: string;
}
declare const UpdateBatchDto_base: import("@nestjs/common").Type<Partial<CreateBatchDto>>;
export declare class UpdateBatchDto extends UpdateBatchDto_base {
}
export declare class AddStudentDto {
    student_id: string;
}
export {};
