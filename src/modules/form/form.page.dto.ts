import { ObjectType } from '@nestjs/graphql';
import { Page } from '@/models/base/pagination';
import { Form } from '@/models/form.model';

@ObjectType()
export class FormPage extends Page(Form) {

}
