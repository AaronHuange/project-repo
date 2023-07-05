import { HttpModule } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ApiService } from './service';
import { getJestToken } from '@/utils/jestToken';
import models from '@/models';
import config from '@/config';

const token = getJestToken();

describe('apiService', () => {
  let apiService: ApiService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HttpModule,
        WinstonModule.forRootAsync({
          useFactory: () => ({
            // options
          }),
          inject: [],
        }),
        TypeOrmModule.forFeature(models),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            ...config.typeOrm,
          } as TypeOrmModuleAsyncOptions),
        }),
      ],
      controllers: [],
      providers: [ApiService],
    })
      .compile();
    apiService = module.get<ApiService>(ApiService);
  });

  it('getUserInfo', async () => {
    const res = await apiService.getUserInfo(token);
    expect(res.data.id).toHaveReturned();
  });

  it('getUserByMobile', async () => {
    console.info(await apiService.findUserByMobile('18679655704'));
  });
});
