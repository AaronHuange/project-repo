import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';

@Catch() // 捕获所有类型异常?
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    this.logger.warn(exception.toString());
    const httpArgumentsHost = host.switchToHttp();
    const response = httpArgumentsHost.getResponse();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    try {
      const errorOption = exception.getResponse();
      response.code(status).send(errorOption);
    } catch (err) {
      response.code(status).send({
        code: 100001,
        msg: '请求失败',
      });
    }
  }
}
