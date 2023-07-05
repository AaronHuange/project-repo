import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import models from '@/models';
import services from '@/services';
import { ComponentResolver } from '@/modules/component/component.resolver';
import { ComponentService } from '@/modules/component/component.service';

@Module({
  imports: [TypeOrmModule.forFeature(models), HttpModule],
  providers: [ComponentResolver, ComponentService, ...services],
})
export class ComponentModule {}
