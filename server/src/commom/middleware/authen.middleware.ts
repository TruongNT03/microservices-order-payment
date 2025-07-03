import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      // Giả lập lấy token người dùng
      if (true) {
        console.log('Xác thực thành công!');
        next();
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
