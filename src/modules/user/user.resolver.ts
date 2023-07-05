import {
  Parent, Query, ResolveField, Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaaSAuthGuard } from '@/filters/paas-auth.guard';
import { User } from '@/filters/user.decorator';
import { User as UserType } from '@/models/user.model';
import { UserService } from '@/modules/user/user.service';

@Resolver(() => UserType)
@UseGuards(PaaSAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {
  }

  // eslint-disable-next-line class-methods-use-this
  @Query(() => UserType)
  user(
    @User() user,
  ): UserType {
    const userType = new UserType();
    userType.id = user.id;
    return userType;
  }

  // eslint-disable-next-line class-methods-use-this
  @ResolveField('isAdmin', () => Boolean)
  async isAdmin(
    @Parent() user: UserType,
  ) {
    return this.userService.isAdmin(user.id);
  }
}
