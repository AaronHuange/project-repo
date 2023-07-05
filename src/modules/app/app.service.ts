import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { App } from '@/models/app.model';
import { User } from '@/filters/user.decorator';
import { ICloudUserInfo } from '@/modules/api/type';
import { getUuid } from '@/utils/uuid';
import { PaaSAuthGuard } from '@/filters/paas-auth.guard';
import { ApiService } from '@/modules/api/service';

@UseGuards(PaaSAuthGuard)
export class AppService {
  constructor(
    @InjectRepository(App)
    private readonly appRepository: Repository<App>,
    private dataSource: DataSource,
    private apiService: ApiService,
  ) {
  }

  @Mutation(() => App)
  async bindObjectToForm(@User() user: ICloudUserInfo, @Args('objectAppId') objectAppId: string) {
    let objectServiceKey = '';
    try {
      const objectApp = await this.apiService.getObjectApp(user.id, objectAppId);
      if (!objectApp) {
        throw new Error('无效的自定义对象应用');
      }
      objectServiceKey = objectApp.serviceApiKey;
    } catch (e) {
      throw new Error('服务繁忙,请稍后重试');
    }

    return this.dataSource.transaction(async (manager) => {
      let app = await manager.findOne(App, {
        where: { userId: user.id },
        transaction: true,
        lock: { mode: 'pessimistic_write' },
      });

      if (!app) {
        app = new App();
        app.id = getUuid();
        app.userId = user.id;
      }
      app.objectAppId = objectAppId;
      app.objectServiceKey = objectServiceKey;

      app = manager.merge(App, app, {
        objectAppId,
        objectServiceKey,
      });

      return manager.save(app);
    });
  }
}
