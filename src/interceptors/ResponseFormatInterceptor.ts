import {
  CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';

/** 将响应数据当做data，组装成正常的响应结构 **/
@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const call$ = next.handle();
    const request = context.switchToHttp().getRequest();
    if (request.url.endsWith('/statusMonitor')) {
      const response = context.switchToHttp().getResponse();
      response.header('Content-Type', 'text/html; charset=utf-8');
      console.log('response.headers', JSON.stringify(response.headers.set));
      return call$;
    }
    const target = context.getHandler();
    console.log('TransformInterceptor target ====', target);
    const code = this.reflector.get<string>('__customHttpSuccessResponseCode__', target) || HttpStatus.OK;
    const msg = this.reflector.get<string>('__customHttpSuccessResponseMessage__', target) || '数据请求成功';
    const usePaginate = this.reflector.get<boolean>('__customHttpResponseTransformPagenate__', target);
    return call$.pipe(
      map((item: any) => {
        const data = item;
        return { code: Number(code), msg, data };
      }),
    );
  }

}
