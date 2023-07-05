import { Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaaSAuthGuard } from '@/filters/paas-auth.guard';
import { User } from '@/filters/user.decorator';
import { App } from '@/models/app.model';

@UseGuards(PaaSAuthGuard)
export class AppResolver {
  constructor(
    @InjectRepository(App)
    private readonly appRepository: Repository<App>,
  ) {
  }

  @Query(() => App, { nullable: true })
  async app(@User() user): Promise<App | null> {
    return this.appRepository.findOne({
      where: { userId: user.id },
      select: {
        objectServiceKey: false,
      },
    });
  }
}
