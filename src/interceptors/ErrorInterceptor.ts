import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext, HttpException, HttpStatus,
} from '@nestjs/common';

/** 当服务发生错误时,将被捕获 **/
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const call$ = next.handle();
    const target = context.getHandler();
    const code = this.reflector.get<string>('__customHttpSuccessResponseCode__', target) || 100001;
    const status = this.reflector.get<HttpStatus>('__customHttpErrorResponseStatus__', target) || 500;
    const msg = this.reflector.get<string>('__customHttpErrorResponseMessage__', target) || '数据请求失败';
    return call$.pipe(
      catchError((error) => {
        console.log('error=======', error.response, error.status, error.message);
        if (error.response && error.status) {
          return throwError(error);
        }
        throw(
          new HttpException(
            {
              code: `${code}`,
              msg,
              errors: error.message,
            },
            status,
          )
        );
      }),
    );
  }
}
