import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import models from '@/models';
import services from '@/services';
import { FormPermissionResolver } from './form_permission.resolver';
import { FormPermissionService } from './form_permission.service';

@Module({
    imports: [TypeOrmModule.forFeature(models), HttpModule],
    providers: [FormPermissionResolver, FormPermissionService, ...services],
  })
  export class FormPermissionModule { }
