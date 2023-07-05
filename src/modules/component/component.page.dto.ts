import { ObjectType } from '@nestjs/graphql';
import { Page } from '@/models/base/pagination';
import { Component } from '@/models/component.model';

@ObjectType()
export class ComponentPage extends Page(Component) {}
