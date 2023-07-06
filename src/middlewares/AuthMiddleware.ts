import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): any {
    // 在这里编写登录校验的逻辑
    // 如果校验通过，可以调用 next() 方法继续执行下一个中间件或路由处理器
    // 如果校验不通过，可以返回适当的响应或抛出异常中断请求处理流程
    console.log('Request...AuthMiddleware');
    next();
  }
}
