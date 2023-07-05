import { Injectable } from '@nestjs/common';
import { Equal, In } from 'typeorm';

@Injectable()
export class UserService {
  public static adminUserIds: string[] = (process.env.ADMIN_USER_IDS || '').split(',');

  // eslint-disable-next-line class-methods-use-this
  isAdmin(userId: string) {
    return UserService.adminUserIds.includes(userId);
  }

  static findOwnerOperator(userId: string) {
    if (UserService.adminUserIds.includes(userId)) {
      return In([...UserService.adminUserIds, userId]);
    }
    return Equal(userId);
  }
}
