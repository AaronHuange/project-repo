import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { FormResolver } from './form.resolver';
import models from '@/models';
import { FormService } from './form.service';
import services from '@/services';

@Module({
  imports: [TypeOrmModule.forFeature(models), HttpModule],
  providers: [FormResolver, FormService, ...services],
})
export class FormModule {}
