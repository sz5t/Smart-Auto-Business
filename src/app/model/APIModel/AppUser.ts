import {User} from '@delon/theme';

/**
 * Created by zhaoxinlei on 2018/3/23.
 */
export class AppUser  implements  User {
  Birthday?: string;
  Code: string;
  CreateTime: string;
  Grender: string;
  Id: string;
  IdCardNumber: string;
  LoginLimitKind: string;
  MailAddress: string;
  MobileNumber: string;
  Name: string;
  NickName: string;
  Password: string;
  PersonId: string;
  PlatCustomerId: string;
  RealName: string;
  Remark: string;
  Status: string;
  UserType: string;
}

/**
 * 系统缓存内容
 */
export class CacheInfo
{
  UserId: string;
  ApplyId: string;
  ProjectId: string;
  PlatCustomerId: string;
  RealName: string;
}
