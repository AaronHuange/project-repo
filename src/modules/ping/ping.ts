import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class Ping {
  // eslint-disable-next-line class-methods-use-this
  @Get()
  ping() {
    return 'pong';
  }

  @Get('/pri/ping')
  pingPri() {
    return 'pong';
  }
}
