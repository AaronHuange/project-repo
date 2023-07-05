import { Field, ObjectType } from '@nestjs/graphql';
import { ICloudUserInfo } from '@/modules/api/type';

@ObjectType()
export class UserType {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  mobile: string;

  @Field(() => String, { nullable: true })
  avatar?: string;

  fromICloudUserInfo(user: ICloudUserInfo) {
    if (!user) return;
    this.id = user.id;
    this.name = user.name;
    this.mobile = user.mobile && `${user.mobile.substring(0, 3)}***${user.mobile.substring(7)}`;
  }
}
