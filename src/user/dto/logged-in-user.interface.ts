import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entity/user.entity';

export class LoggedInUserDto {
  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  token: string;
}
