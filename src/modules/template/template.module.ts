import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { FormTemplateResolver } from './form-template.resolver';
import models from '@/models';
import { FormTemplateService } from './form-template.service';
import services from '@/services';

@Module({
  imports: [TypeOrmModule.forFeature(models), HttpModule],
  providers: [FormTemplateResolver, FormTemplateService, ...services],
})
export class TemplateModule {}
