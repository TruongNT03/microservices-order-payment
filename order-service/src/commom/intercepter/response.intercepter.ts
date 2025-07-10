import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseIntercepter implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: data.message,
        statusCode: context.switchToHttp().getResponse<Response>().statusCode,
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
