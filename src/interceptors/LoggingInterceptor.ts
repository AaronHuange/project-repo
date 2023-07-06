import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Injectable, NestInterceptor, CallHandler, ExecutionContext, Logger,
} from '@nestjs/common';

/** 拦截请求日志 **/
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const call$ = next.handle();
    const request = context.switchToHttp().getRequest();
    if (!request) return call$;
    const content = `${request.method} 请求-> ${request.url}`;
    const body = request.body ? JSON.stringify(request.body) : '{}';
    this.logger.log(`收到：${content}, body: ${body}`);
    const now = Date.now();
    return call$.pipe(tap(() => this.logger.log(`响应请求：${content} ${Date.now() - now}ms`)));
  }
}
