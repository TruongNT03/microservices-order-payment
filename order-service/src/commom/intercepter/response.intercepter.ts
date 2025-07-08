import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
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
        statusCode: context.switchToHttp().getResponse().statusCode,
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
