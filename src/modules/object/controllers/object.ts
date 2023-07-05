import {
  Body, Controller, Headers, Post,
} from '@nestjs/common';
import ObjectService from '../services/object';

/**
 * 自定义对象graphql权限服务
 */
@Controller('object')
export default class ObjectGraphqlController {
  constructor(private readonly service: ObjectService) { }

  @Post()
  async object(@Body() params: any, @Headers() header) {
    const res = await this.service.handle(params, header);
    return res;
  }
}
