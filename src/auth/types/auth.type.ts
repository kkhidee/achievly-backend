import { UserEntity } from '@/user/entity/user.entity';

export interface ISocialProfile {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

export interface ICookies {
  refreshToken?: string;
  accessToken?: string;
}

export type TGuardUser = Pick<UserEntity, 'id' | 'username'>;
