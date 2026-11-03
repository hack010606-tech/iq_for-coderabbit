import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class ExamAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare const CurrentUser: (...dataOrPipes: any[]) => ParameterDecorator;
