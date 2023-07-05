import { HttpException } from '@nestjs/common';

export class ProjectException extends HttpException {
  constructor(error: { code: number; msg: string }) {
    super(error.msg, error.code);
  }
}
