import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from 'shared';
import { ControllerResponse } from 'src/shared/types/controller-response.type';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const res = data as ControllerResponse;
        return {
          success: true,
          statusCode: response.statusCode,
          message: res?.message ?? 'Request completed successfully',
          data: (res?.data !== undefined ? res.data : data) as T,
        };
      }),
    );
  }
}
